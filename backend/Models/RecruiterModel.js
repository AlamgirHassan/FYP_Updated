const mongoose = require('mongoose');
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const recruiterSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    
    email:{
        type: String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    phonenumber:{
        type: String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    country:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    image:{
        type:String
    },
   

    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
},
{
    timestamps:true,
})


recruiterSchema.pre('save',async function(next)
{
    //if password is modified
    if(this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password,12);
    }
    next();

});

//Generating token

recruiterSchema.methods.generateAuthToken = async function()
{
    try
    {
        let token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(err)
    {
        console.log(err);
    }
}
const Recruiter = mongoose.model('Recruiter', recruiterSchema);
module.exports = Recruiter;