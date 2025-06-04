const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        // trim:true
    },
    userID:{
        type:Number,
        required:true,
        unique:true
    },
    lastName:{
        type:String,
        required:true
    },      
    contactNumber:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    additionalDetail : {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"Profile"
    },
    image:{
        type:String,
        required: true
    },
    accountType:{
        type:String,
        enum: ["Admin", "Student", "Instructor", "Manager"],
        required: true
    },
    projects:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Project"
        }
    ],
    teamLead:{
        type:Boolean
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OTP"
    }
});

module.exports = mongoose.model("User", userSchema);