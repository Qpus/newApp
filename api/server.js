const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Set up PostgreSQL connection
const pool = new Pool({
  host: "your host",
  user: "database username",
  password: "database pass",
  database: "database name", // Single database for all users
  port: 5432,
});

// Create users table (run this at server start if the table doesn't exist)
pool.query(
  `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
`,
  (err) => {
    if (err) console.error("Error creating users table:", err);
  }
);

pool.query(
  `
    CREATE TABLE IF NOT EXISTS user_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        item TEXT NOT NULL
    );
`,
  (err) => {
    if (err) console.error("Error creating user_items table:", err);
  }
);

//API to signup user
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE, password TEXT)`
    );
    await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [
      username,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User signed up successfully!" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: "Error signing up user" });
  }
});

// API to login a user
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch the user from the database
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Successfully logged in
    res.status(200).json({ message: "Login successful!", userId: user.id });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Error logging in" });
  }
});

// API to save an item
app.post("/save", (req, res) => {
  const { item, userId } = req.body; // Assume userId is being passed from the frontend after login

  pool.query(
    "INSERT INTO user_items (user_id, item) VALUES ($1, $2)",
    [userId, item],
    (err) => {
      if (err) {
        console.error("Error saving item:", err);
        res.status(500).json({ error: "Error saving item" });
      } else {
        res.status(201).json({ message: "Item saved successfully!" });
      }
    }
  );
});

// API to read items
app.get("/read", (req, res) => {
  const { userId } = req.query; // Assume userId is passed from the frontend as a query parameter

  pool.query(
    "SELECT * FROM user_items WHERE user_id = $1",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error reading items:", err);
        res.status(500).json({ error: "Error reading items" });
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
});

// API to delete an item
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM user_items WHERE id = $1", [id], (err) => {
    if (err) {
      console.error("Error deleting item:", err);
      res.status(500).json({ error: "Error deleting item" });
    } else {
      res.status(200).json({ message: "Item deleted successfully!" });
    }
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
