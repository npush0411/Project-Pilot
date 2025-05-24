const User = require('../models/User');
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const Profile = require('../models/Profile')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Controls = require('../models/Controls');

// Three Functions are there in this file 
//     1-> sendOTP() => to send the otp
//     2-> signUp() => to signUp or register new user
//     3-> login() => to login properly

//sendOTP
exports.sendOTP = async (req, res) => {
    try{
        //fetch email from req body
        const {email} = req.body;
 
        //check user existence
        const checkUserPresent = await User.findOne({email});
        //if user exist then return response
        if(checkUserPresent)
        {5
            return res.status(401).json({
                success: false,
                message: "User Already Exists !!"
            });
        }
        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log("OTP generated Successfully !!");

        //check uniquie OTP 
        const result = await OTP.findOne({otp:otp});
        
        while(result)
        {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({opt:otp});
        }

        //Create OTP object !!
        const otpPayload = {email, otp};

        //create an entry in DB for OTP
        const otpbody = await OTP.create(otpPayload);
        console.log(otpbody);
        res.status(200).json({
            success:true,
            message:"OTP Sent Successfully !!"
        });
    }catch(error){
        console.log("OTP Send nahi ho paya Jii !!");
        res.status(500).json({
            success:false,
            message: error.message
        })
   }
}

//SignUp
exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, cPassword, accountType, contactNumber, userID } = req.body;

        if (!firstName || !lastName || !email || !password || !cPassword || !accountType || !contactNumber || !userID) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        if (password !== cPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match!" });
        }

        // const permission = await Controls.find({});
        // if(!permission.createUser)
        // {
        //     return res.status(400).json({
        //         success:false,
        //         message:"User Creation is not Permitted ! Please Contact Admin !"
        //     });
        // }

        const exist = await User.findOne({ userID });
        if (exist) {
            return res.status(409).json({ success: false, message: "User ID already taken!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profile = await Profile.create({
            gender: null,
            about: null,
            dateOfBirth: null,
            contactNo: null,
        });
        const eotp = otpGenerator.generate(6, {
            upperCaseAlphabets:true,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        const motp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets:true,
            specialChars:true
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            userID,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetail: profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully!",
            user,
        });

    } catch (err) {
        console.error("Error during signup:", err);
        return res.status(500).json({ success: false, message: "Internal server error!" });
    }
};

//Login
exports.login = async (req, res) => {
    try {
        const { userID, password } = req.body;

        // Validate input
        if (!userID || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details !!",
            });
        }

        // Check if the user exists
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered !!",
            });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials !!",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful !!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.accountType,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong !!",
        });
    }
};

//changePassword 
exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Validate input
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details !!",
            });
        }

        // Check if the user exists
        const id = req.user._id
        const user = await User.findOne({id});
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found !!",
            });
        }

        // Validate old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect old password !!",
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully !!",
        });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong !!",
        });
    }
};


exports.verifyOTP = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { eotp, motp } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const recentOTP = await OTP.findOne({ email: user.email }).sort({ createdAt: -1 });
        if (!recentOTP) return res.status(400).json({ success: false, message: "No OTP found" });

        if (recentOTP.eotp !== eotp || recentOTP.motp !== motp) {
            return res.status(400).json({ success: false, message: "Invalid OTPs" });
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).json({ success: true, message: "User verified successfully" });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Error verifying OTP" });
    }
};
