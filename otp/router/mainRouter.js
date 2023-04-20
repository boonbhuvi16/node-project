const express = require('express');
const http = require('http');
var request = require('superagent');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/emailDB', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// define a schema for user data
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (v) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
      message: (props) => `${props.value} is not a valid email address`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  otp: {
    type: Number,
    required: true,
  },
  emailVerified:{
    type:Boolean,
    required: false,
  },
  otpExpiresAt: {
    type: Date,
    required: true,
  },
});
const User = mongoose.model('User', userSchema);


Router.get('/', function (req, res){

    res.render('register');
})
Router.get('/otp', function (req, res){

  res.render('otp');
})
Router.post('/register', async function (req, res){
  const { email, password } = req.body;
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email address is already in use' });
  }
  // Generate random OTP
  const otp = crypto.randomInt(100000, 999999);
  // Save user with OTP and OTP expiration time
  const otpExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes
  const user = new User({ email, password, otp, otpExpiresAt });
  try {
    await user.save();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save user' });
  }

  // Send email with OTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'boonbhuvi16@gmail.com',
      pass: 'owlqvrnykgsrfhjo',
    },
  });

  const mailOptions = {
    from: 'boonbhuvi16@gmail.com',
    to: email,
    subject: 'Verification Code for Your Account',
    text: `Your verification code is ${otp}`,
  };
console.log('mailOptions', mailOptions)
  try {
    await transporter.sendMail(mailOptions);
    res.redirect("/otp");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
})
Router.post('/verify', async function (req, res){
  const email = req.body.email;
  
  const digit1= req.body.code1;
  const digit2 = req.body.code2;
  const digit3 = req.body.code3;
  const digit4 = req.body.code4;
  const digit5 = req.body.code5;
  const digit6 = req.body.code6;

   const verificationCode = "digit1+digit2+digit3+digit4+digit5+digit6";
   
  User.findOne({ email: email }, async (err, user) => {
    if (err) {
      // Handle the error
      console.error(err);
      return;
    }
    console.log(user)
    if (!user) {
      // Handle the case where the user was not found
      res.json({ message: 'User Not Found.' });
      return;
    }
    
    // Get the value of the OTP field from the user instance
    const otp = user.otp;

    if(otp == verificationCode){
      User.updateOne({ email: email }, { emailVerified: true }, (err, result) => {
        if (err) {
          // Handle the error
          console.error(err);
          return;
        }
      
        // Log the result of the update operation
        console.log(result);
      });
  
      res.json({ message: 'Email verified successfully.' });
    }else {
      // OTP is invalid
      res.status(400).json({ message: 'Invalid OTP.' });
    }
    
    // Do something with the OTP value
    console.log('The OTP value is:', otp);
  });
 
});

module.exports = Router;