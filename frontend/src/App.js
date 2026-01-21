import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Notes from "./components/Notes";
import "./App.css";

// ✅ Backend base URL
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true); // 🔑 prevent flicker

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("tokenStore");

      if (!token) {
        setIsLogin(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/user/verify`, {
          headers: { Authorization: token },
        });

        setIsLogin(res.data);
      } catch (err) {
        localStorage.clear();
        setIsLogin(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  // ✅ Stop UI flicker
  if (loading) return null;

  return (
    <div className="App">
      {isLogin ? (
        <Notes setIsLogin={setIsLogin} />
      ) : (
        <Login setIsLogin={setIsLogin} />
      )}
    </div>
  );
}

export default App;
