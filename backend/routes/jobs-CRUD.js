// Import necessary modules
const express = require("express");
const pool = require("../config/db");
const { verifyToken, requireRole } = require("../middlewares/auth");

// Create a router instance
const router = express.Router();

// Register a new job
router.post(
  "/job/register",
  verifyToken,
  requireRole("company"),
  async (req, res) => {
    // Require job details from the request body
    const { title, description, skillsreq, location, salary, companyId } =
      req.body;

    try {
      // Insert the new job into the database
      await pool.query(
        "INSERT INTO job (title, description, skillsreq, location, salary, companyId) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description, skillsreq, location, salary, companyId]
      );
      res.status(201).json({ message: "Job registered successfully!" });
    } catch (err) {
      console.error("Job Registration Error:", err);
      res.status(500).json({
        error: "Server error during job registration",
        details: err.message,
      });
    }
  }
);

// Get all jobs
router.get("/jobs", async (req, res) => {
  try {
    // Fetch all jobs from the database
    const [jobs] = await pool.query("SELECT * FROM job");
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Fetch Jobs Error:", err);
    res.status(500).json({
      error: "Server error while fetching jobs",
      details: err.message,
    });
  }
});

// Edit a job
router.put(
  "/job/edit/:id",
  verifyToken,
  requireRole("company"),
  async (req, res) => {
    const jobId = req.params.id;
    const { title, description, skillsreq, location, salary } = req.body;

    // check if the companyId matches the job's companyId
    try {
      const [job] = await pool.query("SELECT * FROM job WHERE id = ?", [jobId]);
      if (job.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }
      if (job[0].companyId !== req.user.companyId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to edit this job" });
      }
      // Update the job in the database
      await pool.query(
        "UPDATE job SET title = ?, description = ?, skillsreq = ?, location = ?, salary = ? WHERE id = ?",
        [title, description, skillsreq, location, salary, jobId]
      );
      res.status(200).json({ message: "Job updated successfully!" });
    } catch (err) {
      console.error("Job Update Error:", err);
      res.status(500).json({
        error: "Server error during job update",
        details: err.message,
      });
    }
  }
);

// Delete a job
router.delete(
  "/job/delete/:id",
  verifyToken,
  requireRole("company"),
  async (req, res) => {
    const jobId = req.params.id;

    // check if the companyId matches the job's companyId
    try {
      const [job] = await pool.query("SELECT * FROM job WHERE id = ?", [jobId]);
      if (job.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }
      if (job[0].companyId !== req.user.companyId) {
        return res
          .status(403)
          .json({ error: "You do not have permission to delete this job" });
      }
      // Delete the job from the database
      await pool.query("DELETE FROM job WHERE id = ?", [jobId]);
      res.status(200).json({ message: "Job deleted successfully!" });
    } catch (err) {
      console.error("Job Deletion Error:", err);
      res.status(500).json({
        error: "Server error during job deletion",
        details: err.message,
      });
    }
  }
);

// Get only jobs of a specific company
router.get(
  "/jobs/company/:companyId",
  verifyToken,
  requireRole("company"),
  async (req, res) => {
    const companyId = req.params.companyId;
    try {
      // Fetch jobs for the specified company from the database
      const [jobs] = await pool.query("SELECT * FROM job WHERE companyId = ?", [
        companyId,
      ]);
      if (jobs.length === 0) {
        return res
          .status(404)
          .json({ error: "No jobs found for this company" });
      }
      res.status(200).json(jobs);
    } catch (err) {
      console.error("Fetch Company Jobs Error:", err);
      res.status(500).json({
        error: "Server error while fetching company jobs",
        details: err.message,
      });
    }
  }
);

// Get a specific job by ID
router.get("/job/:id", async (req, res) => {
  const jobId = req.params.id;
  try {
    // Fetch the job by ID from the database
    const [job] = await pool.query("SELECT * FROM job WHERE id = ?", [jobId]);
    if (job.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job[0]);
  } catch (err) {
    console.error("Fetch Job Error:", err);
    res.status(500).json({
      error: "Server error while fetching job",
      details: err.message,
    });
  }
});


// Export the router
module.exports = router;
