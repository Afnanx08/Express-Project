const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Helper function to generate tokens
const generateToken = (user, secret, expiresIn) => {
  return jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    },
    secret,
    { expiresIn }
  );
};

// @desc Register a user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

// @desc Login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  // Compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET,
      "15m"
    );
    const refreshToken = generateToken(
      user,
      process.env.REFRESH_TOKEN_SECRET,
      "1d"
    );

    // Store refreshToken with user
    user.refreshToken = refreshToken;
    await user.save();

    // Send HttpOnly cookie with refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

// @desc Current user info
// @route POST /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc Refresh token
// @route POST /api/users/refresh
// @access public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newAccessToken = generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET,
      "15m"
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
});

module.exports = { registerUser, loginUser, currentUser, refreshToken };
