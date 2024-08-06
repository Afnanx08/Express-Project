const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  refreshToken,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
router.post("/refresh", refreshToken);

module.exports = router;
