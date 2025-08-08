// Import necessary modules
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Create a router instance
const router = express.Router();

// Register a new company
router.post("/company/register", async (req, res) => {
  // Require company details from the request body
  const { companyname, location, phoneno, email, password } = req.body;

  // Hash the password using bcrypt
  const hashed = await bcrypt.hash(password, 10);

  try {
    // Check if email is already in company table
    const [existingCompanies] = await pool.query(
      "SELECT * FROM company WHERE email = ?",
      [email]
    );
    if (existingCompanies.length > 0) {
      return res
        .status(400)
        .json({ message: "Email already registered as a company" });
    }

    // Check if email is already in employee table
    const [existingEmployee] = await pool.query(
      "SELECT * FROM employee WHERE email = ?",
      [email]
    );
    if (existingEmployee.length > 0) {
      return res
        .status(400)
        .json({ message: "Email already registered as an employee" });
    }

    // Insert the new company into the database
    await pool.query(
      "INSERT INTO company (companyname, location, phoneno, email, password) VALUES (?, ?, ?, ?, ?)",
      [companyname, location, phoneno, email, hashed]
    );

    res.status(201).json({ message: "Company registered successfully!" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({
      error: "Server error during registration",
      details: err.message,
    });
  }
});


// Login as a company
router.post('/company/login', async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query('SELECT id, email, password FROM company WHERE email = ?', [email]);
  
  if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  console.log('user:', user);
const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
  
  res.json({ token });
});


module.exports = router;
