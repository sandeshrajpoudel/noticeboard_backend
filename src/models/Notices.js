const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");


const noticeSchema  = new mongoose.Schema({
    title :{
        type  : String,
        required : true
    },
    added_by :{
      type  : mongoose.Schema.Types.ObjectId,
      ref: "Users"
   },
   description :{
    type  : String,
    required : true
   },
  
   thum_img:{
    type  : String,
    required: true

},
  date :{
      type : Date,
      default : Date.now(),
      required: true
  }

});












module.exports =mongoose.model('Notices',noticeSchema);