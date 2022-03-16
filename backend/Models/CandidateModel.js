const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const CandidateSchema= new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    emp_status:{
        type:String,
        required:true
    },
    img_url:{
        type:String,
      
    },
    password:{
        type:String,
        required:true
    },
    dob: {
        type:String,
        required:true,
        
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
});
CandidateSchema.pre('save',async function(next)
{
    //if password is modified
    if(this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password,12);
    }
    next();

});


//Generating token

CandidateSchema.methods.generateAuthToken = async function()
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

const Candidate=mongoose.model("Candidate",CandidateSchema);

module.exports=Candidate;