const CandidateModel = require("../Models/CandidateModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const path = require('path');

//To register a Candidate
const register_candidate = async (req, res) => {
    //Getting image 
    var myfile = req.files.image_url;
    //Getting variables from body
    const { firstname, lastname, email, country, address, gender, emp_status, password, dob } = req.body;

    if (!firstname || !lastname || !email || !address || !country || !gender || !emp_status || !password || !dob) {
        console.log('Please fill all details');
        return res.status(422).json({ error: "Please fill all the required fields properly" });
    }
    //Checking if email already exist
    const userExist = await CandidateModel.findOne({ email: email });
    if (userExist) {
        console.log('Email already registered');
        return res.status(422).json({ error: "Email already exist" });
    }
    else {

        try {

            const img_url = email + "_" + myfile.name;
            const user = new CandidateModel({ firstname, lastname, email, address, country, gender, emp_status, password, dob, img_url });
            const datasaved = await user.save();

            if (datasaved) {
                console.log('Registered successfully');
                res.status(201).json({ message: "User registered successfully" })
                //If image exist
                //To shift candidate image to a folder
                if (req.files) {

                    const img_url = email + "_" + myfile.name;
                    const user = new CandidateModel({ firstname, lastname, email, address, country, gender, emp_status, password, dob, img_url });
                    const datasaved = await user.save();
                    console.log("Image ", img_url);
                    if (datasaved) {
                        console.log('Registered successfully');
                        res.status(201).json({ message: "User registered successfully" })

                        if (req.files) {

                            let newpath = path.join(process.cwd(), 'candidate_images', img_url)
                            req.files.image_url.mv(newpath);
                        }
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
};
//To Login Candidate
const login_candidate = async (req, res) => {
    //Getting data from body
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Please fill data");
        res.status(422).json({ error: "Please fill required data" });
    }
    const loginUser = await CandidateModel.findOne({ email: email });
    //If email does not match
    if (!loginUser) {
        console.log("Email does not exist");
        res.status(422).json({ error: "Invalid Creadential" });
    }
    else {
        try {
            //Checking if user entered password equal to decrypted password
            const isMatch = await bcrypt.compare(password, loginUser.password);
            //generating json web token
            const token = await loginUser.generateAuthToken();
            //creating cookie and setting expire in today+30days in milliseconds
            //jwtokens is name of cookie
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
                const name = loginUser.firstname + " " + loginUser.lastname;
                res.status(201).json({ message: name });
            }
        }
        catch (error) {
            console.error(error);
        }

    }
}
//Getting information of candidate
const login_candidate1 = async (req, res) => {

    try {
        //Getting email from parameters
        const email = req.params.email;
        //Checking email exists or not
        const loginUser = await CandidateModel.findOne({ email: email });
        if (!loginUser) {
            console.log("Email does not exist");
            res.status(422).json({ error: "Invalid Creadential" });
        }
        else {
            //Getting all information in form of JSON
            const data = {
                firstname: loginUser.firstname,
                lastname: loginUser.lastname,
                email: loginUser.email,
                address: loginUser.address,
                dob: loginUser.dob,
                status: loginUser.emp_status,
                gender: loginUser.gender,
                country: loginUser.country,
                image: loginUser.img_url,
            }
            res.status(201).json({ message: data });
        }
    }
    catch (err) {
        console.log('Error : ', err);
    }
}
//Candidate Profile Information
const update_candidate = async (req, res) => {
    //Getting email from paramters & data from body
    const email = req.params.email;
    const userdata = req.body;
    try {  
        //Checking if email exists
        const loginUser = await CandidateModel.findOne({ email: email });
        if (loginUser) {
            //Updating information
            loginUser.firstname = userdata.firstname;
            loginUser.lastname = userdata.lastname;
            loginUser.address = userdata.address;
            loginUser.dob = userdata.dob;
            loginUser.emp_status = userdata.emp_status;
            loginUser.country = userdata.country;
            loginUser.gender = userdata.gender;
            loginUser.save();
            res.status(201).json({ message: "Data updated successfully" });
        }
        else {
            res.status(422).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(422).json({ error: error.message });
    }
}
const getcookie = (req, res) => {
    res.send("Cookies");
}
//Recruiter Change Password
const candidate_change_pass = async (req, res) => {
    const userdata = req.body;
    try {
        //Checking if email exists
        const loginUser = await CandidateModel.findOne({ email: userdata.email });
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
                    text: `Dear ${loginUser.firstname + ' ' + loginUser.lastname},\n\tYour password has been changed.\nRegards,\nHRAA Team.`
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
    login: login_candidate,
    register: register_candidate,
    info: login_candidate1,
    update: update_candidate,
    cookie: getcookie,
    newpass: candidate_change_pass,

}


