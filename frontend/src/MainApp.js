import React, { useEffect, useState } from "react";

const MainApp = ({ loggedInUser }) => {
  const [savedItems, setSavedItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Function to fetch items from the database
  const fetchItems = async () => {
    try {
      const response = await fetch(
        `http://107.20.129.158:3000/read/${loggedInUser}`
      );
      const data = await response.json();
      setSavedItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Handle adding a new item
  const handleSave = async () => {
    try {
      const response = await fetch("http://107.20.129.158:3000/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: newItem, username: loggedInUser }),
      });

      setNewItem("");
      fetchItems(); // Refresh the list after saving
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Handle deleting an item
  const handleDelete = async (id) => {
    try {
      await fetch(`http://107.20.129.158:3000/delete/${id}/${loggedInUser}`, {
        method: "DELETE",
      });

      setSavedItems(savedItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h1>{loggedInUser}'s Items</h1>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Enter a new item"
      />
      <button onClick={handleSave}>Save Item</button>

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
  );
};

export default MainApp;
