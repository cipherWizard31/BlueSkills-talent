// Import necessary modules
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { verifyToken } = require("../middlewares/auth");

// Create a router instance
const router = express.Router();

// Register a new employee
router.post("/employee/register",  async (req, res) => {
  // Require company details from the request body
  const { fullname, skills, email, password, phoneno, location, resumeUrl, about } = req.body;

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
      "INSERT INTO employee (fullname, skills, email, password, phoneno, location, resumeUrl, about, profilePic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [fullname, skills, email, hashed, phoneno, location, resumeUrl, about, profilePicUrl]
    );

    res.status(201).json({ message: "Employee registered successfully!" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({
      error: "Server error during registration",
      details: err.message,
    });    
  }
});


// Login as an employee
router.post('/employee/login', async (req, res) => {
    const { email, password } = req.body;
  
    const [rows] = await pool.query('SELECT id, email, password FROM employee WHERE email = ?', [email]);
    
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


// Edit Profile for employees
router.put('/employee/profile', verifyToken, async (req, res) => {
  const employeeId = req.user.id;
  const fields = req.body;

  if (!employeeId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM employee WHERE id = ?', [employeeId]);

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const current = existing[0];

    // Use new values if provided, otherwise keep the old ones
    const updatedDoctor = {
      fullname: fields.fullname || current.fullname,
      email: fields.email || current.email,
      phoneno: fields.phoneno || current.phoneno,
      skills: fields.skills || current.skills,
      resumeurl: fields.resumeurl || current.resumeurl,
      password: fields.password || current.password,
      location: fields.location || current.location,
      about: fields.about || current.about
    };

    // Perform the update
    await pool.query(
      `UPDATE doctor SET fullname = ?, email = ?, phoneno = ?, skills = ?, resumeurl = ?, password = ?, location = ?, about = ? WHERE id = ?`,
      [
        updatedDoctor.fullname,
        updatedDoctor.email,
        updatedDoctor.phoneno,
        updatedDoctor.skills,
        updatedDoctor.resumeurl,
        updatedDoctor.password,
        updatedDoctor.location,
        updatedDoctor.about,
        employeeId
      ]
    );

    res.status(200).json({ message: 'Employee profile updated successfully' });

  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Database update failed', error: err.message });
  }
});



// DELETE Employee Profile
router.delete('/employee/profile', verifyToken, async (req, res) => {
  const employeeId = req.user?.id;

  if (!employeeId) {
    return res.status(401).json({ message: 'Unauthorized: Missing Employee ID' });
  }

  try {
    const [result] = await pool.query('DELETE FROM employee WHERE id = ?', [employeeId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found or already deleted' });
    }

    res.status(200).json({ message: 'Employee profile deleted successfully' });

  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ message: 'Database deletion failed', error: err.message });
  }
});


// Get profile of the logged-in employee
router.get('/employee/profile', verifyToken, async (req, res) => {
  const employeeId = req.user.id;

  if (!employeeId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM employee WHERE id = ?', [employeeId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const employee = rows[0];

    res.status(200).json({
      id: employee.id,
      fullname: employee.fullname,
      email: employee.email,
      phoneno: employee.phoneno,
      skills: employee.skills,
      resumeurl: employee.resumeurl,
      location: employee.location,
      about: employee.about,
      profilePic: employee.profilePic
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Database query failed', error: err.message });
  }
});


module.exports = router;
