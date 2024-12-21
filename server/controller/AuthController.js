const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const express = require("express");
const { successful, error } = require("../util/resWaper"); // Import from wrapper.js
require("dotenv").config("./.env");

// **Signup Controller**
const Signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json(error(400, "All fields are required"));
    }

    // Check if user already exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).json(error(409, "User already exists"));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate tokens
    const accessToken = accesstoken(newUser);
    const refreshToken = GetReftoken(newUser);

    // Set refresh token in cookies
    res.cookie("jwt", refreshToken, { httpOnly: true, secure: false });

    // Send response
    return res.status(201).json(
      successful(201, {
        user: { username: newUser.username, email: newUser.email },
        token: accessToken,
        message: "User successfully registered",
      })
    );
  } catch (err) {
    console.error("Signup Error:", err.message);
    return res.status(500).json(error(500, "Internal Server Error", err.message));
  }
};
// **Login Controller**
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json(error(400, "Email and password are required"));
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(error(404, "Account not found. Please create an account."));
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json(error(401, "Incorrect password"));
    }

    // Generate tokens
    const token = accesstoken(user);
    const Reftoken = GetReftoken(user);

    // Set refresh token in cookie
    res.cookie("jwt", Reftoken, { httpOnly: true, secure: false });

    return res.status(200).json(
      successful(200, {
        user: { username: user.username, email: user.email },
        token,
        message: "Login successful",
      })
    );
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json(error(500, "Internal Server Error", err.message));
  }
};
const logout = async (req, res) => {
  try {
    // Clear cookies so that user cookies out and user not able to refrach pages
    res.clearCookie('jwt', { httpOnly: true, secure: false }); 

    // Return a success response
    return res.json(successful(200,{message:"logout"}));
  } catch (err) {
    console.error('Error during logout:', err);
    return res.json(500,{
      message:"error to logout"
    });
  }
};

// **Get New Access Token Controller**
const getnewaccesstoken = async (req, res) => {
  const cookie = req.cookies;

  // Check for refresh token in cookies
  if (!cookie.jwt) {
    return res
      .status(401)
      .json(error(401, "Refresh token not provided in cookies"));
  }

  const Reftoken = cookie.jwt;

  try {
    // Verify refresh token
    const decoded = jwt.verify(Reftoken, process.env.REF_TOKEN);
    const { _id } = decoded;

    // Generate new access token
    const token = accesstoken({ _id });

    return res.status(201).json(
      successful(201, {
        token,
        message: "New access token generated",
      })
    );
  } catch (err) {
    console.error("Error verifying refresh token:", err.message);
    return res
      .status(403)
      .json(error(403, "Invalid or expired refresh token", err.message));
  }
};

// **Token Generators**
const accesstoken = (data) => {
  return jwt.sign({ _id: data._id }, process.env.ACCESS, { expiresIn: "24h" });
};

const GetReftoken = (data) => {
  return jwt.sign({ _id: data._id }, process.env.REF_TOKEN, { expiresIn: "1y" });
};

module.exports = {
  Signup,
  Login,
  logout,
  getnewaccesstoken,
};
