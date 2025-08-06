import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "Please login",
      });
    }

    const token = authHeader.split(" ")[1]; 

    const decode = jwt.verify(token, process.env.Jwt_Secret); 

    req.user = await User.findById(decode._id);
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
