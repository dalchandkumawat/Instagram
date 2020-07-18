const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const crypto=require('crypto')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
//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
const {SENDGRID_API,EMAIL} =require('../config/keys')
const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!email||!password||!name){
        return res.status(422).json({error:"Please add all the fields"});
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json(({error:"User already exists with that email"}))
        }
        bcrypt.hash(password,12).then(hashedpassword=>{            
            const user=new User({
                email,password:hashedpassword,name,pic
            })
            user.save().then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"dalchandkumawat585@gmail.com",
                    subject:"Signup Successful",
                    html:"<h1>Welcome to Instagram</h1>"
                })
                res.json({message:"Signup successful!"})
            }).catch(err=>{
                console.log(err);
            })
        })
    }).catch(err=>{
        console.log(err);
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"Please add email or password"});
    }
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"});
        }
        bcrypt.compare(password,savedUser.password).then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                const {_id,name,email,followers,following,pic} = savedUser;
                res.json({token,user:{_id,name,email,followers,following,pic}});
            }
            else{
                return res.status(422).json({error:"Invalid email or password"});
            }
        }).catch(err=>{
            console.log(err);
        })
    })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err) console.log(err);
        const token= buffer.toString("hex");
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User doesn't exist with that email"});
            }
            user.resetToken=token;
            user.expireToken= Date.now()+3600000;
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"dalchandkumawat585@gmail.com",
                    subject:"Password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                    `
                });
                res.json({message:"Please check your email"});
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newpassword=req.body.newpassword;
    const sentToken=req.body.token;
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again"})
        }
        bcrypt.hash(newpassword,12).then(hashedpassword=>{
            user.password=hashedpassword;
            user.resetToken=undefined;
            user.expireToken=undefined;
            user.save().then(()=>{
                res.json({message:"Password changed"})
            })
        })
    }).catch(err=>console.log(err));
})

module.exports = router;