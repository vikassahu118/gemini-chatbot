import { Chat } from "../models/Chat.js";
import { Conversation } from "../models/Conversation.js";
import { marked } from "marked";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Create a new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chat = await Chat.create({
      user: userId,
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get all chats for user
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Add conversation with streaming + markdown to HTML
export const addConversation = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat)
      return res.status(404).json({
        message: "No chat with this id",
      });

    const { question } = req.body;

    // 🧠 Gemini Streaming Response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContentStream([question]);

    let answerMarkdown = "";

    for await (const chunk of result.stream) {
      answerMarkdown += chunk.text();
    }

    // 📄 Convert Markdown to HTML
    const answerHtml = marked.parse(answerMarkdown);

    // 💬 Store conversation
    const conversation = await Conversation.create({
      chat: chat._id,
      question,
      answer: answerHtml, // Save HTML
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { latestMessage: question },
      { new: true }
    );

    // 📤 Send to frontend
    res.status(200).json({
      success: true,
      question,
      answer: answerHtml,
      conversation,
      updatedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get all conversations from a chat
export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({ chat: req.params.id });

    if (!conversation)
      return res.status(404).json({
        message: "No conversation with this id",
      });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Delete a chat
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat)
      return res.status(404).json({
        message: "No chat with this id",
      });

    if (chat.user.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });

    await chat.deleteOne();

    res.json({
      message: "Chat Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
