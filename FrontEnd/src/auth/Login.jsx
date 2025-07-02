import { useState } from "react";
import API from "../api/axios";
import { saveToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const callAIDiceAPI = async () => {
    try {
      await API.post("/ai/dice", {
        bet: 1,
        target: 50,
        over: false,
      });
    } catch (err) {
      console.error("AI Dice API call failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      saveToken(res.data.token);
      await callAIDiceAPI();
      navigate("/game");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{
      backgroundColor: "#0f0f0f",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      fontFamily: "sans-serif"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#1e1e1e",
          padding: "30px",
          borderRadius: "10px",
          width: "300px",
          boxShadow: "0 0 10px rgba(0, 224, 255, 0.3)"
        }}
      >
        <h2 style={{ textAlign: "center", color: "#00e0ff" }}>🔐 Login</h2>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={inputStyle()}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={inputStyle()}
        />
        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#00e0ff",
            border: "none",
            borderRadius: "8px",
            color: "#000",
            fontWeight: "bold",
            width: "100%",
            cursor: "pointer",
            boxShadow: "0 0 8px #00e0ff"
          }}
        >
          Login 🚀
        </button>
      </form>
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    backgroundColor: "#2a2a2a",
    border: "1px solid #444",
    color: "white",
    borderRadius: "6px",
    fontSize: "14px"
  };
}
