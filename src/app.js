const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const RegRouter =require("./routes/RegisterRouter");
const expressValidator = require('express-validator')


dotenv.config();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.DB_URl,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connected to database")})
    .catch((error)=>{
        console.log(error)
    })


 
app.use(express.json());
app.use(expressValidator);
app.use('/api/users',RegRouter);
app.listen(PORT,()=>{
    console.log(`server running at   http://localhost:${PORT}/api/users  ./\\.`);

});
