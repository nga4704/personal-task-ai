const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// ================= REGISTER =================
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    lastLogin: new Date(),
    streak: 1,
  });

  res.status(201).json({
    success: true,
    message: "Register successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ================= LOGIN =================
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // ===== STREAK SYSTEM =====
  const today = new Date();

  const lastLogin = user.lastLogin;

  if (lastLogin) {
    const diffDays = Math.floor(
      (today - lastLogin) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      user.streak += 1;
      user.points += 10;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
  }

  user.lastLogin = today;

  const accessToken = generateAccessToken(user._id);

  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;

  await user.save();

  res.json({
    success: true,
    accessToken,
    refreshToken,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      points: user.points,
      streak: user.streak,
      role: user.role,
    },
  });
});

// ================= REFRESH TOKEN =================
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token",
    });
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await User.findById(decoded.id);

  if (
    !user ||
    user.refreshToken !== refreshToken
  ) {
    return res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  const newAccessToken = generateAccessToken(
    user._id
  );

  res.json({
    success: true,
    accessToken: newAccessToken,
  });
});

// ================= LOGOUT =================
exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = "";

    await user.save();
  }

  res.json({
    success: true,
    message: "Logout successful",
  });
});

// ================= GET PROFILE =================
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(
    req.user._id
  ).select("-password");

  res.json({
    success: true,
    user,
  });
});