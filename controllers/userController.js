const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// Mock user data for demonstration purposes
const mockUser = {
  id: "55555",
  username: "55555",
  email: "55555@qq.com",
  password: "55555", // In a real scenario, you wouldn't expose this
};

// Mock access token
const mockAccessToken = "mockAccessToken123456";

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  
  // Mock logic to check if the user is already registered
  if (email === mockUser.email) {
    res.status(400);
    throw new Error("User already registered");
  }

  // Return mock user creation response
  res.status(201).json({ _id: mockUser.id, email: mockUser.email });
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  // Mock logic to validate the email and password
  if (email === mockUser.email && password === mockUser.password) {
    res.status(200).json({ accessToken: mockAccessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  // Return mock user information
  res.json({
    id: mockUser.id,
    username: mockUser.username,
    email: mockUser.email,
  });
});

module.exports = { registerUser, loginUser, currentUser };
