const path=require('path');
const multer=require('multer');
var storeat=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"images/")
    },
    filename:function(req,file,cb)
    {
        let ext=path.extname(file.originalname);
        cb(null,Date.now()+" "+ext)
    }
})

var upload=multer({
    storage:storeat,
    fileFilter:function(req,file,callback)
    {
        if(file.mimetype==="image/png"||file.mimetype==="image/jpg"||file.mimetype==="image/jpeg"||file.mimetype==="image/jfif")
        {
            callback(null)
        }
        else
        {
            console.log("Only jpg,jpeg, png and jfif ");
            callback(null,false)
        }
    },
    limits:
    {
        fileSize:1024*1024*4
    }
})

module.exports=upload