const mongoose = require('mongoose');
const comSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
        trim: true
    },
    price:{
        type:Number,
        required:true
    },
    minPurchace:{
        type:Number,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
})

module.exports = mongoose.Schema("Component", comSchema);