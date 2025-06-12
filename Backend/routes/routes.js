const express = require('express');
const router = express.Router();

// Middleware
const { auth, authorizeRole } = require('../middlewares');

// Auth controllers
const { login, signUp, verifyOTP, getCurrentUser, verifyToken } = require("../controllers/Auth");

// Project Controllers
const { createProject, getAllProjects, getAllUsers, getUserProjects } = require("../controllers/Project");

// Component controllers
const {getAllComponents, deleteComponent, createComponent, getComponent, updateComponent, makeAvailable} = require("../controllers/Components");
const { createTeam } = require('../controllers/Team');

// --- Auth Routes ---
router.post("/login", login);
router.post("/signup", signUp);
router.post("/verify", verifyOTP);
router.get("/get-all-users",   getAllUsers);
router.get("/me",auth,  getCurrentUser);
router.get("/verify-token", verifyToken);

// --- Component Routes ---
router.post("/create-component", auth,  createComponent);
router.get("/get-all-components", getAllComponents);
router.get("/get-component/:cID", auth, getComponent);
router.delete("/delete-component/:cID", auth, authorizeRole("Admin", "Manager"), deleteComponent);
router.put("/update-component/:cID", auth, authorizeRole("Admin", "Manager"), updateComponent);
router.put("/make-available/:cID", auth,  makeAvailable);
// --- Team Routes ---
router.post("/create-team", auth,  createTeam);

// --- Project Routes ---
router.post("/create-project",   createProject);
router.get("/get-all-projects", auth, authorizeRole("Admin", "Manager", "Instructor"), getAllProjects);
router.get("/projects-me", auth,  getUserProjects);
// Optional: Future Protected Controls
// router.put("/get-controls", auth, authorizeRole("Instructor"), yourController);

module.exports = router;
