const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        // trim:true
    },
    lastName:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
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
        enum: ["Admin", "Student", "Instructor"],
        required: true
    }
});

module.exports = mongoose.Schema("User", userSchema);