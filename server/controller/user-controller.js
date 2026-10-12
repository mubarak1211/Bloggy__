const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const { signToken } = require("../utils/token");

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const signUp = async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (name.length < 2 || !email || password.length < 8) {
    return res.status(400).json(new ApiError(400, "Enter a name, valid email, and password with at least 8 characters."));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(new ApiError(409, "An account with this email already exists."));
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });
    const token = signToken(user._id);

    return res.status(201).json(new ApiResponse(201, {
      user: publicUser(user),
      token,
    }, "Account created."));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json(new ApiError(409, "An account with this email already exists."));
    }
    console.error("Signup failed:", error);
    return res.status(500).json(new ApiError(500, "Could not create the account."));
  }
};

const logIn = async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";
  if (!email || !password) {
    return res.status(400).json(new ApiError(400, "Enter your email and password."));
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json(new ApiError(401, "Email or password is incorrect."));
    }

    return res.status(200).json(new ApiResponse(200, {
      user: publicUser(user),
      token: signToken(user._id),
    }, "Signed in."));
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json(new ApiError(500, "Could not sign in."));
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(404).json(new ApiError(404, "Account not found."));
    return res.status(200).json(new ApiResponse(200, { user: publicUser(user) }, "Account loaded."));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Could not load the account."));
  }
};

const updateCurrentUser = async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  if (name.length < 2 || name.length > 60) {
    return res.status(400).json(new ApiError(400, "Name must be between 2 and 60 characters."));
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name } },
      { new: true, runValidators: true, select: "name email" }
    );
    if (!user) return res.status(404).json(new ApiError(404, "Account not found."));
    return res.status(200).json(new ApiResponse(200, { user: publicUser(user) }, "Profile updated."));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Could not update your profile."));
  }
};

module.exports = { signUp, logIn, getCurrentUser, updateCurrentUser };
