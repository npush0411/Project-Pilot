const mongoose = require('mongoose');
const prjSchema = new mongoose.Schema({
    title:{
        type: String,
        required: trueZ
    },
    ID:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        trim: true
    },
    components:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Component"
        }
    ],
    team:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
    projectGuide:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

module.exports = mongoose.Schema("Project", prjSchema);