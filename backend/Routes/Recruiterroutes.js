const express=require("express");
const authenticate=require("../Middleware/Authenticate")
const {login,register,info,update, addjob,getjob,detail, edit,alljobs,deletejob,change_pass}=require("../Controllers/recruitercontroller.js");
const router=express.Router();
//To get information of recruiter through its email
router.get("/info/:email",authenticate,info);
//To get all jobs that are posted by a recruiter through recruiter's email
router.get("/jobs/:email",authenticate,getjob);
//To get detail of a job through job id
router.get("/detail/:id",authenticate,detail);
//To get all jobs that are posted till date
router.get("/alljobs",authenticate,alljobs);
//To update recruiter detail
router.put("/update/:email",update);
//To update job detail
router.put("/updatedetail/:id", edit);
//To delete job 
router.delete("/deletejob/:id",deletejob);
//Recruiter registeration
router.post("/register",register);
//Recruiter Login
router.post("/login",login);
//Add Job by recruiter
router.post("/addjob", addjob);
//Changing Recruiter Password
router.post('/newpass',change_pass);



module.exports=router;