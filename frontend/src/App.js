import React, { useState } from "react";

function App() {
  // State to store the input value and saved items
  const [inputValue, setInputValue] = useState("");
  const [savedItems, setSavedItems] = useState([]);

  // Function to handle the input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to save the input value
  const handleSave = () => {
    if (inputValue.trim() !== "") {
      setSavedItems([...savedItems, inputValue]);
      setInputValue(""); // Reset input field
    }
  };

  // Function to read saved items (you can customize this if you read from storage)
  const handleRead = () => {
    alert("Items read successfully!");
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
