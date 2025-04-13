const express = require('express');
const router = express.Router();

const {login, signUp, verifyOTP} = require("../controllers/Auth");
router.post("/login", login);
router.post("/signup", signUp);
router.post("/verify", verifyOTP);


module.exports = router;
