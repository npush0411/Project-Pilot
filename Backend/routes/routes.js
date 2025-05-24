const express = require('express');
const router = express.Router();

// Auth controllers
const { login, signUp, verifyOTP } = require("../controllers/Auth");

//Project Controllers
const {createProject, getAllProjects, getAllUsers} = require("../controllers/Project");

// Component controllers
const { getAllComponents, deleteComponent, createComponent, getComponent, updateComponent, makeAvailable } = require("../controllers/Components");

// Auth Routes
router.post("/login", login);
router.post("/signup", signUp);
router.post("/verify", verifyOTP);
router.get("/get-all-users", getAllUsers);

// Component Routes
router.post("/create-component", createComponent);
router.get("/get-all-components", getAllComponents);
router.get("/get-component/:cID", getComponent);
router.delete("/delete-component/:cID", deleteComponent);
router.put("/update-component/:cID", updateComponent); 
router.put("/make-available/:cID", makeAvailable );

//Project Routes
router.post("/create-project", createProject);
router.get("/get-all-projects", getAllComponents);

//Controls !
// routes.put("/get-controls", auth, )  

module.exports = router;
