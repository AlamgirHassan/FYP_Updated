const express=require('express');
const fileupload=require("express-fileupload");
const candidate=require("./Routes/Candidateroutes.js");
const recruiter=require("./Routes/Recruiterroutes.js");
const dotenv=require('dotenv');
const mydb=require("./Database/db.js");
const cors = require('cors')
const path=require('path')
const authenticate=require("./Middleware/Authenticate.js");
const cookieParser =require("cookie-parser");
const bodyParser = require('body-parser');
const nodemailer=require('nodemailer');



/*const multer=require("multer");
const filestorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./images")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"--"+file.originalname)
    },
})
const upload=multer({storage:filestorage});*/

const app= express();
app.use(cors())
app.use(fileupload({
    useTempFiles:true
}));

//app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.json());

app.use("/candidate",candidate);
app.use("/recruiter",recruiter);


//Candidate & Recruiter logout
app.get("/logout",(req,res)=>{
    console.log(req.cookies.jwt);
    res.clearCookie("jwt",{path:'/'});
    res.status(200).send("User Logout successfully");
})

// To get Candidate profile image 
app.get("/candidate_img/:path",(req,res)=>{
    let file = req.params.path;
    const fileLocation="candidate_images/"+file;
    res.sendFile(__dirname+"/"+fileLocation);
})
//To get Recruiter profile image
app.get("/recruiter_img/:path",(req,res)=>{
    let file = req.params.path;
    const fileLocation="recruiter_images/"+file;
    res.sendFile(__dirname+"/"+fileLocation);
})

dotenv.config({path:'./config.env'});

const port=process.env.PORT;
app.listen(port,()=>console.log(`server is up at PORT # ${port}`));