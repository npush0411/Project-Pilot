const User = require('../models/User');
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const Profile = require('../models/Profile')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        {
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
    try{
        //data fetch from req
        const {firstName, lastName, email, password, cPassword, accountType, contactNumber, otp} = req.body;

        //validate data
        if(!firstName || !email || !lastName || !cPassword || !password || !otp)
        {
            return res.status(403).json({
                success:false,
                message:"All details are required !!"
            });
        }

        //match both passwords
        if(password !== cPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Password and Confirmed Password must match !"
            });
        }

        //user existance
        const exist = await User.findOne({email});
        if(exist){
            return res.status(400).json({
                success:false,
                message:"User is already registered !!"
            });
        }

        //find most recent OTP for the user
        const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent OPT : ", recentOTP);

        //validate OTP
        if(recentOTP.length == 0) 
        {
            //OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP didn't found / Length not valid !!"
            });
        }
        else if(otp !== recentOTP[0].otp) //check weather they're equal
        {
            //Invalid OTP
            return res.status(400).json({
                success:false,
                message:"OTPs didn't match properly !!"
            });
        }

        //Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create Additional details profile !! 
        const profile = await Profile.create({
            gender:null,
            about:null,
            dateOfBirth:null,
            contactNo:null,
        });

        //create entry in DB 
        const user = await User.create({
            firstName,
            lastName,
            password:hashedPassword,
            accountType,
            email,
            contactNumber,
            additionalDetail: profile.id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        //return res !! 
        return res.status(200).json({
            success:true,
            message:"User is Registered Successfully",
            user
        })
    }catch(error) {
        console.log("Error in User creation");
        return res.status(500).json({
            success:false,
            message:"User can't be registerd please try again !!"
        })
    }
}

//Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details !!",
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email });
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
            { userId: user._id, role: user.role },
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
                role: user.role,
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
