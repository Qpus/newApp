const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const app = express();
const port = 3000;

app.use(bodyParser.json());

// PostgreSQL connection setup
const pool = new Pool({
  user: "postgres",
  host: "mylist.ckoda7e9oezp.us-east-1.rds.amazonaws.com",
  database: "list",
  password: "Eukaliptus992",
  port: 5432,
});

// Create table if it doesn't exist
pool.query(
  "CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, item TEXT)",
  (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table created or already exists");
    }
  }
);

// API to get all items
app.get("/read", (req, res) => {
  pool.query("SELECT * FROM items", (err, result) => {
    if (err) {
      res.status(500).json({ error: "Error fetching items" });
    } else {
      res.status(200).json({ items: result.rows });
    }
  });
});

// API to save a new item
app.post("/save", (req, res) => {
  const { item } = req.body;
  pool.query(
    "INSERT INTO items (item) VALUES ($1) RETURNING *",
    [item],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error saving item" });
      } else {
        res.status(200).json({ message: "Item saved!", item: result.rows[0] });
      }
    }
  );
});

// API to delete an item
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  pool.query("DELETE FROM items WHERE id = $1", [id], (err) => {
    if (err) {
      res.status(500).json({ error: "Error deleting item" });
    } else {
      res.status(200).json({ message: "Item deleted!" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
