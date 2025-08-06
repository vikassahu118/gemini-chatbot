import sendMail from "../middlewares/sendMail.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
      });
    }

    const otp = Math.floor(Math.random() * 900000);

    const verifyToken = jwt.sign({ userId: user._id, otp }, process.env.Activation_sec, {
      expiresIn: "5m",
    });

    await sendMail(email, "ChatBot", otp);

    res.json({
      message: "Otp send to your mail",
      verifyToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { otp, verifyToken } = req.body;

    const verify = jwt.verify(verifyToken, process.env.Activation_sec);

    if (!verify)
      return res.status(400).json({
        message: "Otp Expired or Invalid",
      });

    if (verify.otp !== Number(otp))
      return res.status(400).json({
        message: "Wrong otp",
      });

    // ✅ Correct: fetch user from DB
    const user = await User.findById(verify.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Correct: sign new token using real user
    const token = jwt.sign({ _id: user._id }, process.env.Jwt_Secret, {
      expiresIn: "5d",
    });

    // ✅ Correct: return the real user and token
    res.json({
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
