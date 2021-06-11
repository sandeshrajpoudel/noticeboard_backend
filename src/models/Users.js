const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
    name :{
        type  : String,
        required : true
    } ,
    email :{
      type  : String,
      required : true,
      unique:true
    
  } ,
  password :{
      type  : String,
      required : true
      
  } ,
 // phone :{
  //  type  : String,
   // required : true,
//maxLength:10
//    } ,
address :{
    type  : String,
    default:"Gandaki province Nepal"
} ,
  date :{
      type : Date,
      default : Date.now
  },
  roles:{
      type: String,
      default:"USER",
      enum: ["USER", "ADMIN"]
  }
});





module.exports =mongoose.model('Users',userSchema);