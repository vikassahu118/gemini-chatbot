import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import toast from "react-hot-toast";
import { UserData } from "./UserContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [createLod, setCreateLod] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuth } = UserData(); // ✅ get auth status from context

  // 🚀 Fetch Gemini AI Response
  async function fetchResponse() {
    if (!prompt) return alert("Write prompt");

    setNewRequestLoading(true);
    const inputPrompt = prompt;
    setPrompt("");

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBr_2Dj_bhhxTsoIDJ-uPGHMeRf3Y64-hQ",
        {
          contents: [{ parts: [{ text: inputPrompt }] }],
        }
      );

      const answer =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      const message = {
        question: inputPrompt,
        answer,
      };

      setMessages((prev) => [...prev, message]);
      setNewRequestLoading(false);

      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `${server}/api/chat/${selected}`,
        {
          question: inputPrompt,
          answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("❌ fetchResponse error:", error);
      alert("Something went wrong");
      setNewRequestLoading(false);
    }
  }

  // 📩 Fetch All Chats
  async function fetchChats() {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token not found for fetching chats");
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setChats(data);
      setSelected(data.length > 0 ? data[0]._id : null);
    } catch (error) {
      console.error("❌ Fetch Chats Error:", error.response?.data || error.message);
    }
  }

  // ➕ Create New Chat
  async function createChat() {
    setCreateLod(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `${server}/api/chat/new`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchChats();
      setCreateLod(false);
    } catch (error) {
      toast.error("Something went wrong");
      setCreateLod(false);
    }
  }

  // 📥 Fetch Messages by Chat ID
  async function fetchMessages() {
    if (!selected) return;
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(`${server}/api/chat/${selected}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Fetch Messages Error:", error);
      setLoading(false);
    }
  }

  // ❌ Delete Chat
  async function deleteChat(id) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.delete(`${server}/api/chat/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message);
      fetchChats();
      window.location.reload();
    } catch (error) {
      console.error("❌ Delete Chat Error:", error);
      alert("Something went wrong");
    }
  }

  // 🟡 Fetch chats only after login
  useEffect(() => {
    if (isAuth && localStorage.getItem("token")) {
      fetchChats();
    }
  }, [isAuth]);

  // 🔁 Fetch messages when selected chat changes
  useEffect(() => {
    if (selected) fetchMessages();
  }, [selected]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLod,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
