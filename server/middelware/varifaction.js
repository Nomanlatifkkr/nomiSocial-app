const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../model/user");
const { error } = require("../util/resWaper");

// Load environment variables from .env file
dotenv.config();

// JWT Verification Middleware
const Varifaction = async (req, res, next) => {
  try {
    // Check if Authorization header exists and starts with "Bearer "
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message: "Token is missing or invalid.",
      });
    }

    // Extract token
    const token = req.headers.authorization.split(" ")[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.ACCESS);

    // Assign the user ID from the token payload to req._id
    req._id = decoded._id;
    const user=await User.findById(req._id);
    if(!user){
      return res.status(404).json(error(404,{
        message:"the user is not found"
      }))
    }

    console.log("Valid Token:", token);
    console.log("Decoded Payload:", decoded);

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
        details: error.message,
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired.",
        details: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Internal server error.",
        details: error.message,
      });
    }
  }
};

module.exports = { Varifaction };
