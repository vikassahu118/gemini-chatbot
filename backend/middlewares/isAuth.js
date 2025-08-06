import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check for presence of Authorization header and valid format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Please login" });
    }

    const token = authHeader.split(" ")[1];

    // Validate token is not null or invalid string
    if (!token || token === "null" || token === "undefined") {
      return res.status(403).json({ message: "Invalid token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.Jwt_Secret);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(500).json({ message: "Server error during authentication" });
  }
};
