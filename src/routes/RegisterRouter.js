const express = require("express");
const Router = express.Router();
const Users = require('../models/Users')
const Notices = require('../models/Notices')


const {body} = require('express-validator')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {auth,verifytoken, uploadmidd} = require("../middlewares/auth")






Router.get('/register', (req,res)=>{
res.json();
});

Router.post('/register', body('name')
.isLength({min: 1}).withMessage("name cant be empty"), 
body('email').isEmail().withMessage("not a valid email")
.isLength({min: 10}).withMessage("email not valid"),
body('password')
.isLength({min: 6}).withMessage("password must be  6 character long"),
async (req,res)=>{
    

try {

  const emailExists = await Users.findOne({
    email:req.body.email
  });

  if(emailExists){
    res.json("email already exists");
  
  }else{

  const hash_password=await bcrypt.hash(req.body.password,10);
  console.log('1')

  
    const User =new Users({
    name:req.body.name,
    email: req.body.email,
    password: hash_password,
  });



  await User.save();
  res.json(User);
}
} catch (error) {
  res.json(error.toString())
}
});

Router.get('/login',
(req,res)=>{
  res.json();
})


Router.post('/login',
body('email').isEmail().withMessage("not a valid email")
.isLength({min: 10}).withMessage("email not valid"),
body('password')
.isLength({min: 6}).withMessage("password must be  6 character long"),async(req,res)=>{
try {
  

  const userEmail= await Users.findOne({email:req.body.email});

    if(userEmail==null){
        res.json({
            status : "fail",
            data : {message: 'Username doesnt exists.'} 
        });        

    }
    else if((await bcrypt.compare(req.body.password, userEmail.password))==false)
        {
            res.json({
                status : "fail",
                data : {message: 'password not matching.'} 
            });
            
    }else{
      const token = jwt.sign({
        _id:Users._id},
         process.env.SECRET_KEY);
      
      //res.header('auth-token',token).send(token);
      
      res.json({
        status : "Success",
        data : { userEmail,token }

      })
    }
  } catch (error) {
    console.log(error);
    res.json(error);

  
  }

  });




/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
  
  Router.get("/jobs",async (req,res)=>{
   
    try{
        const notices =await Notices.find() 
        res.json(notices)
    }
    catch(error){
        console.log(error)
        res.json({
            status : "error",
            message:"" 
        })
    }
});


Router.get("/addnotices",auth,async (req,res)=>{
  res.json({
    status : "Success",
    message:  ""
  });

});

/////////////////////////////////////post job/////////////////////////////
Router.post('/addnotices',auth,
 uploadmidd,
 body('title')
.isLength({min: 3})
.isEmpty().withMessage("title cant be empty") ,
body('description')
.isLength({min: 10}).withMessage("description ")
.isEmpty().withMessage("fields cant be empty"),
body('myfile').isEmpty().withMessage("fields cant be empty")
,
  async (req,res, next)=>{
    try {
     let postNotice = new Notices({
        title: req.body.title,
        description:req.body.description,
        thum_img: req.file.filename,
    })
    
         await postNotice.save()
         res.json({
          status : "success",
          message: postNotice
      })

    } catch (error) {
        console.log(error)
        res.json({
            status : "error",
            message: error.message
        })

    }
});




Router.put('/:id',auth,verifytoken,uploadmidd,  async (req,res)=>{
  try {
     const FindNotices= await Notices.findById( {
      _id : req.params.id
     })

     FindNotices.title= req.body.title;
     FindNotices.description= req.body.description;
       FindNotices.thumbnail= req.file.filename,
      await FindNotices.save();   

     res.json(FindNotices);
      
  } catch (error) {
    console.log(error)
      res.json({
          status : "error",
          message: error.toString 
      })
      
  }    


});
Router.delete('/:id', verifytoken, auth, async (req,res)=>{
  try {
      const del_notice = await Notices.findById({
          _id : req.params.id
      })

      const del = await del_notice.remove()
      res.json({
          status:'successfull',
          message: 'notice deleted'})
      
  } catch (error) {
      res.json({
          status : "error",
          message: error 
      })

  }

});




module.exports = Router;





// {"title": "flutter developer",
//                 "description": "This job is for flutter engineers",
                
//                 "type": "full time",
//                 "salary": "$900",
//                 "deadline":"------",
//                 "category": "IT jobs"
// }
