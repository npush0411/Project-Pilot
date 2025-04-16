const mongoose = require('mongoose');
const comSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    cID:{
        type:String,
        required:true
    },
    description:{
        type:String,
        trim: true
    },
    qnty:{
        type:Number,
        required:true,
        default:0
    },
    price:{
        type:String,
        required:true
    },
    minPurchace:{
        type:Number,
    },
    loc:{
        type:String
    },
    available:{
        type:Boolean,
        required:true,
        default:false
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

module.exports = mongoose.model("Component", comSchema);