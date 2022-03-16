const express=require("express");
const {register,login,info, update,cookie,newpass}=require("../Controllers/candidatecontroller.js");
const upload=require("../Middleware/upload")
const authenticate=require("../Middleware/Authenticate")
const router=express.Router();
//To get candidate info
router.get("/info/:email",authenticate,info);
//To update candidate info
router.put("/update/:email",authenticate,update);
//Candidate Registeration
router.post("/register",register);
//Candidate Login
router.post("/login",login);
//Candidate Change Password
router.post("/newpass",newpass);

//router.post("/:email",get_info);






module.exports=router;