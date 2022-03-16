const RecruiterModel = require("../Models/RecruiterModel.js");
const JobModel = require("../Models/JobModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path=require('path');
const nodemailer = require('nodemailer');

//To register a recruiter
const register_recruiter = async (req, res) => {
    //Getting image
    var myfile=req.files.image_url;
    //Getting data from body
    const { name, email, country, address, phonenumber, url, password } = req.body;
    if (!name || !email || !country || !address || !phonenumber || !url || !password) {
        console.log('Please fill all details');

        return res.status(422).json({ error: "Please fill all the required fields properly" });
    }
    try {
        //Checking if email exists
        const userExist = await RecruiterModel.findOne({ email: email });
        if (userExist) {
            console.log('Email already registered');
            return res.status(422).json({ error: "Email already exist" });
        }
        else {
            const image=email+"_"+myfile.name;
            //Adding recruiter data
            const user = new RecruiterModel({ name, email, address, phonenumber, url, country, password,image });
            const datasaved = await user.save();
            if (datasaved) {
                console.log('Registered successfully');
                res.status(201).json({ message: "User registered successfully" })
                if(req.files)
                {
                    //Moving recruiter logo to folder
                    let newpath=path.join(process.cwd(),'recruiter_images',image);
                    req.files.image_url.mv(newpath);
                }
            }
            else {
                console.log("not registered")
                res.status(500).json({ message: "User registeration failed" })
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}
//To Login Recruiter
const login_recruiter = async (req, res) => {

    try {
        //Getting data from body
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Please fill data");
            res.status(422).json({ message: "Please fill required data" });
        }
        const loginUser = await RecruiterModel.findOne({ email: email });
        //If email does not match
        if (!loginUser) {
            console.log("Email does not exist");
            res.status(422).json({ error: "Invalid Creadential" });
        }
        else {
            //Checking if user entered password equal to decrypted password
            const isMatch = await bcrypt.compare(password, loginUser.password);
            //generating json web token
            const token = await loginUser.generateAuthToken();
            //creating cookie and setting expire in today+30days in milliseconds
            //jwt is name of cookie
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });
            //If password does not match
            if (!isMatch) {
                console.log("Password does not match");
                res.status(422).json({ error: "Invalid Creadential" });
            }
            else {
                console.log("Login successfull"); 
                res.status(201).json({ message: loginUser.name });
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}
//Getting recruiter information
const info_recruiter = async (req, res) => {
    try {
        const email = req.params.email;
        const loginUser = await RecruiterModel.findOne({ email: email });
        if (!loginUser) {
            console.log("Email does not exist");
            res.status(422).json({ error: "Invalid Creadential" });
        }
        else {
            const data = {
                name: loginUser.name,
                email: loginUser.email,
                phone: loginUser.phonenumber,
                address: loginUser.address,
                websiteurl: loginUser.url,
                country: loginUser.country,
                image: loginUser.image,
            }
            res.status(201).json({ message: data });
        }
    }
    catch (err) {
        console.log('Error ', err);
    }
}
//Updating recruiter information
const update_recruiter = async (req, res) => {
    const email = req.params.email;
    const userdata = req.body;
    try {
        const loginUser = await RecruiterModel.findOne({ email: email });
        if (!loginUser) {
            res.status(422).json({ message: "User not found" });
        }
        else {
            loginUser.name = userdata.name;
            loginUser.phonenumber = userdata.phone;
            loginUser.address = userdata.address;
            loginUser.url = userdata.websiteurl;
            loginUser.country = userdata.country;
            loginUser.save();
            res.status(201).json({ message: "Data updated successfully" });
        }
    }
    catch (error) {
        res.status(422).json({ error: error.message });
    }


}
//Adding a job by recruiter
const addJob = async (req, res) => {
    const { recruiterEmail, jobtitle, skills, description, positions, location, experience, qualification, jobtype, status } = req.body;
    if (!recruiterEmail || !jobtitle || !skills || !description || !positions || !location || !experience || !qualification || !jobtype || !status) {
        console.log('Please fill all details');

        return res.status(422).json({ error: "Please fill all the required fields properly" });
    }
    else {
        const job = new JobModel({ recruiterEmail, jobtitle, skills, description, positions, location, experience, qualification, jobtype, status });
        const datasaved = await job.save();
        if (datasaved) {
            console.log('Job Added successfully');
            res.status(201).json({ message: "Job added successfully" })

        }
        else {
            console.log("not registered")
            res.status(500).json({ message: "Job added failed" })

        }
    }
}
//Getting all jobs
const getjobs = async (req, res) => {
    try {
        const email = req.params.email;
        const loginUser = await JobModel.find({ recruiterEmail: email });
        if (!loginUser) {
            console.log("Email does not exist");
            res.status(422).json({ error: "Invalid Creadential" });
        }
        else {
          
            res.status(201).json({ message: loginUser });
        }
    } catch (error) {
        console.log('Error ', err);
    }
}
//Getting a particular job detail
const getjobdetail = async (req, res) => {
    try {
        const id = req.params.id;
        const loginUser = await JobModel.find({ _id: id });
        if (!loginUser) {
            res.status(422).json({ error: "Invalid Creadential" });
        }
        else {
            res.status(201).json({ message: loginUser });
        }
    } catch (error) {
        console.log('Error ', err);
    }
}
//Editing a job detail
const editjobdetail = async (req, res) => {
    try {
        const id = req.params.id;
        const userdata = req.body;
        const loginUser = await JobModel.findOne({ _id: id });
        if (!loginUser) {
            res.status(422).json({ error: "Job not found" });
        }
        else {
            loginUser.jobtitle = userdata.jobtitle;
            loginUser.skills = userdata.skills;
            loginUser.description = userdata.description;
            loginUser.positions = userdata.positions;
            loginUser.location = userdata.location;
            loginUser.experience = userdata.experience;
            loginUser.qualification = userdata.qualification;
            loginUser.jobtype = userdata.jobtype;
            loginUser.save();
            
            res.status(201).json({ message: "Data updated successfully" });
        }
    }
    catch (error) {
        console.log('Error ', err);
    }
}
//Getting all active jobs
const alljobs = async (req, res) => {
    try {

        const loginUser = await JobModel.find({ status: "open" }).sort({"createdAt":-1});
        if (!loginUser) {
            console.log("Email does not exist");
            res.status(422).json({ error: "Invalid Creadential" });
        }
        else {
           
            res.status(201).json({ message: loginUser });
        }
    } catch (error) {
        console.log('Error ', err);
    }
}
//Deleting a job
const deletejobdetail = async (req, res) => {


    try {
        const id = req.params.id;
        const loginUser = await JobModel.findOne({ _id: id });
        if (!loginUser) {
            res.status(422).json({ error: "Job not found" });
        }
        else {
            console.log(loginUser);
            loginUser.remove({_id:id});
            
            res.status(201).json({ message: "Job deleted successfully" });
        }
    }
    catch (Error) {
        console.log("Error : ", Error);
    }
}
//Changing recruiter password
const recruiter_change_pass = async (req, res) => {
    const userdata = req.body;
    try {
        //Checking if email exists
        const loginUser = await RecruiterModel.findOne({ email: userdata.email });
        if (!loginUser) {
            console.log("User not found")
            res.status(422).json({ message: "User not found" });
        }
        else {
            
           
            //Comparing password with actual password
            const isMatch = await bcrypt.compare(userdata.password, loginUser.password);
            if (!isMatch) {
                console.log("Password not match");
                res.status(422).json({ message: "Password does not match" })
            }
            else {
                //Updating password
                loginUser.password = userdata.newpassword;
                loginUser.save();
                console.log("Updated successufully");
                //Sending mail to candidate
                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "hrautomatedassistant@gmail.com",
                        pass: "mercedes@5002"
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                })
                let mailoption = {
                    from: "alamgirkhan5002@gmail.com",
                    to: loginUser.email,
                    subject: "Password Change",
                    text: `Dear ${loginUser.name} Employee,\n\tYour password has been changed.\nRegards,\nHRAA Team.`
                }
                transporter.sendMail(mailoption, function (err, success) {
                    if (err) {
                        console.log("Error : ", err);
                    }
                    else {
                        console.log("Email sent successfully")
                    }
                });

                res.status(201).json({ message: "Password updated successfully" });


            }
            

        }
    } catch (err) {
        res.status(422).json({ error: err.message });
    }



}


module.exports = {
    login: login_recruiter,
    register: register_recruiter,
    info: info_recruiter,
    update: update_recruiter,
    addjob: addJob,
    getjob: getjobs,
    detail: getjobdetail,
    edit: editjobdetail,
    alljobs: alljobs,
    deletejob:deletejobdetail,
    change_pass:recruiter_change_pass,
}
