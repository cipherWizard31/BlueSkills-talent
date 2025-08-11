// Import necessary modules
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { verifyToken } = require("../middlewares/auth");

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

// Edit Profile for companies
router.put('/company/profile', verifyToken, async (req, res) => {
  const companyId = req.user.id;
  const fields = req.body;

  if (!companyId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM company WHERE id = ?', [companyId]);

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const current = existing[0];

    // Use new values if provided, otherwise keep the old ones
    const updatedDoctor = {
      companyname: fields.companyname || current.companyname,
      location: fields.location || current.location,
      phoneno: fields.phoneno || current.phoneno,
      email: fields.email || current.email,
      password: fields.password || current.password,
      password: fields.password || current.password,
    };

    // Perform the update
    await pool.query(
      `UPDATE doctor SET companyname = ?, location = ?, phoneno = ?, email = ?, password = ? WHERE id = ?`,
      [
        updatedDoctor.companyname,
        updatedDoctor.location,
        updatedDoctor.phoneno,
        updatedDoctor.email,
        updatedDoctor.password,
        employeeId
      ]
    );

    res.status(200).json({ message: 'Company profile updated successfully' });

  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Database update failed', error: err.message });
  }
});



// DELETE company Profile
router.delete('/company/profile', verifyToken, async (req, res) => {
  const companyId = req.user?.id;

  if (!companyId) {
    return res.status(401).json({ message: 'Unauthorized: Missing Company ID' });
  }

  try {
    const [result] = await pool.query('DELETE FROM company WHERE id = ?', [companyId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Company not found or already deleted' });
    }

    res.status(200).json({ message: 'Company profile deleted successfully' });

  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ message: 'Database deletion failed', error: err.message });
  }
});


// Get profile of the logged-in company
router.get('/company/profile', verifyToken, async (req, res) => {
  const employeeId = req.user.id;

  if (!employeeId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM company WHERE id = ?', [companyId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const company = rows[0];

    res.status(200).json({
      id: company.id,
      fullname: company.companyname,
      location: company.location,
      phoneno: company.phoneno,
      email: company.email,
      password: company.password,
      verified: company.verified
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Database query failed', error: err.message });
  }
});


module.exports = router;
