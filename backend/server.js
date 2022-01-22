import express from "express";
import mongoose  from "mongoose";
import router from "./router/userAuth.js";
const app=express();



const DB="mongodb://localhost/MyDB";
app.use(express.json());
mongoose.connect(DB,{useNewUrlParser:true})
.then(()=>{
    console.log('Connection successful with database');
})
.catch((err)=>console.log("No connection with database"));
const port=8000;
app.use('/',router);
app.listen(port,()=>{
    console.log(`Server is running at port # ${port}`)
})