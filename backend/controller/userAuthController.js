import User from "../Model/userModel.js"

const LoginUser=async(req,res)=>{
    const{email,password}=req.body;
    const user = new User({email, password });
            const datasaved = await user.save();
            if (datasaved) {
                console.log('Registered successfully');
                res.status(201).json({ message: "User registered successfully" })
            }
            else {
                console.log("not registered")
                res.status(500).json({ message: "User registeration failed" })
            }

}

export default LoginUser;