const mongoose = require('mongoose');

const prjSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    ID: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true
    },
    components: [
        {
            id:{
                type:String,
                // required:true
            },
            name:{
                type:String,
                required:true
            },
            purpose:{
                type:String,
                trim:true
            },
            quantiy:{
                type:Number,
                required:true,
                default:1
            }
        }
    ],
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    teamID: 
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "teams"
        }
    ,
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    approved: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 3], // Each number corresponds to a status string
        default: 0,
        required: true
    },
    guideID: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    type:{
        type:String,
        required:true
    }
});

// Pre-save hook to manage completedAt based on isCompleted
prjSchema.pre('save', function (next) {
    if (this.isModified('isCompleted')) {
        if (this.isCompleted) {
            this.completedAt = new Date();
        } else {
            this.completedAt = null;
        }
    }
    next();
});

module.exports = mongoose.model("Project", prjSchema);
