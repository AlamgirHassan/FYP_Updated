const jwt =require("jsonwebtoken");
const User=require("../Models/CandidateModel.js");
const Recruiter=require("../Models/RecruiterModel.js");
 
const authenticate=async(req,res,next)=>{
    
    const token=req.cookies.jwt;
    
    try
    {
        //Matching token with secret key 
        const verifytoken=jwt.verify(token,process.env.SECRET_KEY);
        //Matching if the token is of "Candidate"
        let rootUser=await User.findOne({_id:verifytoken._id,"tokens.token":token});
        
        if(!rootUser)
        {   
            //if token is not from "Candidate" collection, it will check from "Recruiter model"  
            const user_id=verifytoken._id;
            rootUser=await Recruiter.find({_id:user_id,"tokens.token":token});
            
            if(!rootUser)
            {
                throw new Error('User not found not authenticate');
            }
          
            
        }
       
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        
        next();
    }
    catch(err)
    {   res.status(401).send({error:"Unauthorized: No token provided"}); 
        console.log(err);
    }

    


}
module.exports=authenticate;