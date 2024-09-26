import React, { useState } from "react";
import Login from "./components/Login";
import axios from "axios";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Track userId after login

  const handleLogin = (id) => {
    setIsLoggedIn(true);
    setUserId(id); // Store the userId
  };

  const [inputValue, setInputValue] = useState("");
  const [savedItems, setSavedItems] = useState([]);

  const API_URL = "http://107.20.129.158:3000";

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = async () => {
    if (inputValue.trim() !== "" && userId) {
      try {
        const response = await axios.post(`${API_URL}/save`, {
          item: inputValue,
          userId, // Include userId in the request
        });
        console.log(response.data); // Debugging: check response data
        setSavedItems([
          ...savedItems,
          { id: response.data.id, item: inputValue },
        ]); // Add the new item to the state
        setInputValue("");
      } catch (error) {
        console.error("Error saving item:", error);
      }
    }
  };

  const handleRead = async () => {
    if (userId) {
      try {
        const response = await axios.get(`${API_URL}/read`, {
          params: { userId }, // Pass userId as a query parameter
        });
        setSavedItems(response.data); // Update savedItems with the fetched data
      } catch (error) {
        console.error("Error reading items:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://107.20.129.158:3000/delete/${id}`, {
        method: "DELETE",
      });
      // Update state to remove the deleted item from the list
      setSavedItems(savedItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="app">
      {isLoggedIn ? (
        <div>
          <h1>Welcome to the App!</h1>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a value"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleRead}>Read</button>

          <h2>Saved Items</h2>
          <ul>
            {savedItems.map((item) => (
              <li key={item.id}>
                {item.item}
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
