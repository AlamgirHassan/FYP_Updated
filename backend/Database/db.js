const mongoose =require("mongoose");
const dotenv=require("dotenv");

dotenv.config({path:'./config.env'});

const db=process.env.DATABASE_URL;
//const db = 'mongodb+srv://umer:umer@cluster0.twtg6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(db,{

    useNewUrlParser: true,

    useUnifiedTopology: true

}).then(()=>

{
    console.log('Connection Successfull')
})
.catch((err)=>
console.log("Problem in Connection", err)
)

module.exports = mongoose