const dotenv = require('dotenv').config();
const jwt = require("jsonwebtoken");
const Notices = require("../models/Notices");
const Users = require('../models/Users');
const mongoose = require('mongoose')
const RegRouter = require("../routes/RegisterRouter")
const multer  = require('multer');
const path = require('path');

const auth = async(req,res,next)=>{
    try {
        const token = req.header("Authorization").split(" ")[1];
        if(token){
            const verUser = jwt.verify(token,process.env.SECRET_KEY)

            next();

        }else{
            res.json({
                status : "fail",
                data :  {message: "unauthorized, login first" }
            });
        } 

     
      

        
    } catch (error) {
        console.log(error.toString())
        res.json({
            status : "error",
            data : {"error": {message: "login first" }}
        });     
    }

}

const verifytoken = async (req,res,next)=>{
try {
    if(!req.header("Authorization")){
        res.json({
            status : "Fail",
            data : { message:"unauthorized"}
        });
    }
    console.log('123')


    const token = req.header("Authorization").split(" ")[1];
    console.log('123')


    const verifyUser = jwt.verify(token,process.env.SECRET_KEY)
    console.log('345')
    const noticeAuthor = await Notices.findById({
        _id:req.params.id
    })

      if(noticeAuthor.added_by==verifyUser._id){
          console.log('a')
          return user_role
      }

 
        if(user_role||Users.role==="ADMIN"){
            console.log('a')
            next();

        }else{
            res.json({
                status : "fail",
                data : {message: "not valid user" }
             } )
        }
    
    
    
} catch (error) {
    res.json({
        status : "error",
        data : {"error": {message: "not valid user" }}
    }); 
    
}
}



const storage = multer.diskStorage({
    destination: (req, res,cb)=>{
        return cb(null,'./uploads')
    },
    filename: (req, file, cb)=> {
        console.log( "filename: "+file.fieldname+ Date.now()+path.extname(file.originalname))
        console.log(file)
      return  cb(null, file.fieldname+path.extname(file.originalname)) 
     }
})

const uploadmidd = multer({ storage:storage}).single('myfile')




module.exports={
    auth, verifytoken, uploadmidd
}