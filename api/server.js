const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); // Import PostgreSQL client

const app = express();
app.use(cors());
app.use(express.json());

// Configure the PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER, // RDS master username
  host: process.env.DB_HOST, // RDS endpoint
  database: process.env.DB_NAME, // Your PostgreSQL database name
  password: process.env.DB_PASSWORD, // RDS master password
  port: 5432, // PostgreSQL port
});

// Create table if not exists
pool.query(
  `
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    item TEXT NOT NULL
  )
`,
  (err, res) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table created or already exists");
    }
  }
);

// API route to save an item to PostgreSQL
app.post("/save", async (req, res) => {
  const { item } = req.body;
  if (item) {
    try {
      const result = await pool.query(
        "INSERT INTO items (item) VALUES ($1) RETURNING *",
        [item]
      );
      res.status(201).json({ message: "Item saved!", item: result.rows[0] });
    } catch (error) {
      console.error("Error saving item:", error);
      res.status(500).json({ error: "Error saving item" });
    }
  } else {
    res.status(400).json({ error: "Invalid item" });
  }
});

// API route to read all saved items from PostgreSQL
app.get("/read", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.status(200).json({ items: result.rows });
  } catch (error) {
    console.error("Error reading items:", error);
    res.status(500).json({ error: "Error reading items" });
  }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});