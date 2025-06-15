const mongoose = require('mongoose');

const req = new mongoose.Schema({
  componentID:{
    type:String,
    required:true
  },
  projectID:{
    type:string
  },
  reqty:{
    type:Number,
    required:true,
    default:0
  },
});

module.exports = mongoose.model('ReqTable', req);