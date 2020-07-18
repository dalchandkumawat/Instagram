const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    followers:[{
        type:ObjectId,ref:"User"
    }],
    following:[{
        type:ObjectId,ref:"User"
    }],
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dalchand/image/upload/v1595053355/Default_skf4f5.jpg"
    }
});
mongoose.model("User",userSchema);