const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json()); // For parsing JSON data in requests

let items = []; // Temporary storage for saved items

// API route to save an item
app.post("/save", (req, res) => {
  const { item } = req.body;
  if (item) {
    items.push(item);
    res.status(201).json({ message: "Item saved!", items });
  } else {
    res.status(400).json({ error: "Invalid item" });
  }
});

// API route to read saved items
app.get("/read", (req, res) => {
  res.status(200).json({ items });
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
