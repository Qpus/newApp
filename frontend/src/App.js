import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [savedItems, setSavedItems] = useState([]);

  const API_URL = "http://107.20.129.158:3000";

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await axios.post(`${API_URL}/save`, {
          item: inputValue,
        });
        setSavedItems(response.data.items);
        setInputValue("");
      } catch (error) {
        console.error("Error saving item:", error);
      }
    }
  };

  const handleRead = async () => {
    try {
      const response = await axios.get(`${API_URL}/read`);
      setSavedItems(response.data.items);
    } catch (error) {
      console.error("Error reading items:", error);
    }
  };

  return (
    <div className="App">
      <h1>React Save and Read App</h1>
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
        {savedItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
