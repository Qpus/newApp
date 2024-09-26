import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "http://107.20.129.158:3000";

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      const { userId } = response.data; // Assuming the response contains userId
      onLogin(userId); // Pass the userId back to App
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Error logging in. Please check your credentials.");
    }
  };

  const handleSignup = async () => {
    if (!username || !password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        username,
        password,
      });
      console.log("User signed up:", response.data);
      handleLogin(); // Auto-login after signup
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("Error signing up. Username might already be taken.");
    }
  };

  return (
    <div>
      <h2>Login or Signup</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Signup</button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
