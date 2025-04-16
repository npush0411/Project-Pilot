const express = require('express');
const router = express.Router();

// Auth controllers
const { login, signUp, verifyOTP } = require("../controllers/Auth");

// Component controllers
const { getAllComponents, deleteComponent, createComponent, getComponent, updateComponent, makeAvailable } = require("../controllers/Components");

// Auth Routes
router.post("/login", login);
router.post("/signup", signUp);
router.post("/verify", verifyOTP);

// Component Routes
router.post("/create-component", createComponent);
router.get("/get-all-components", getAllComponents);
router.get("/get-component/:cID", getComponent);
router.delete("/delete-component/:cID", deleteComponent);
router.put("/update-component/:cID", updateComponent); 
router.put("/make-available/:cID", makeAvailable );
module.exports = router;
