import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { server } from "../main";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();
const navigate = useNavigate

export const UserProvider = ({ children }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Login user by email
  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });

      toast.success(data.message);
      localStorage.setItem("verifyToken", data.verifyToken);
      navigate("/verify");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // Verify OTP and store token
  async function verifyUser(otp, navigate, fetchChats) {
    const verifyToken = localStorage.getItem("verifyToken");
    if (!verifyToken) return toast.error("Token missing. Please login again.");

    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        verifyToken,
      });

      toast.success(data.message);
      localStorage.removeItem("verifyToken");
      localStorage.setItem("token", data.token);

      setIsAuth(true);
      setUser(data.user);
      fetchChats();
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  // Fetch authenticated user
  async function fetchUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsAuth(true);
      setUser(data);
    } catch (error) {
      console.error("Fetch user failed:", error?.response?.data || error.message);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  // Logout handler
  const logoutHandler = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    setIsAuth(false);
    setUser([]);
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        verifyUser,
        logoutHandler,
        btnLoading,
        user,
        isAuth,
        setIsAuth,
        loading,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
