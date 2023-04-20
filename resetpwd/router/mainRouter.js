const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/emailDB', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the User schema
const UserSchema = new mongoose.Schema({
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
    JWTtoken: {
        type: String,
        default: '',
      },
  });

const User = mongoose.model('User', UserSchema);

Router.get('/', function (req, res){

    res.render('login');
})

Router.get('/forgotpassword', function (req, res){

    res.render('forgetPassword');
})

Router.get('/resetpassword', function (req, res){

    res.render('resetPassword');
})

// Define the ForgotPassword schema
const ForgotPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, expires: '5m', default: Date.now },
  
});

const ForgotPassword = mongoose.model('ForgotPassword', ForgotPasswordSchema);

// Configure nodemailer

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'boonbhuvi16@gmail.com',
      pass: 'gochrvidvffderkg',
    },
  });

// Generate a random OTP
function generateOTP() {
  const buffer = crypto.randomBytes(4);
  return buffer.toString('hex');
}

// Send email with OTP
async function sendEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Password',
    text: `Your OTP is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (err) {
    console.log(err);
  }
}

Router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      
      console.log(password);
      console.log(user);
      if (!user) return res.status(401).send('Invalid Username');
      if (password != user.password || user.password == null) return res.status(401).send('Invalid Password');
      
      const JWTtoken = jwt.sign({ email: user.email,password: user.password }, 'mysecretkey',{ expiresIn: '1h' });
      
      console.log(JWTtoken)
      if(JWTtoken){
       
        await User.updateOne({ email: email }, { JWTtoken });
        console.log(user)
        // Return token to client
       
        res.json({ JWTtoken });
        

      }
      
    } catch (err) {
      console.log(err)
      res.status(500).send('Error logging in');
    }
  });

// Forgot password route
Router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Generate OTP
  const otp = generateOTP();

  // Save OTP to database
  const forgotPassword = new ForgotPassword({ email, otp});
  await forgotPassword.save();

  console.log(forgotPassword)
  // Send email with OTP
  await sendEmail(email, otp);
  res.redirect('/resetpassword');
  
});

// Reset password route
Router.post('/resetpassword', async (req, res) => {
  const { email, otp, password } = req.body;

  // Check if OTP is valid
  const forgotPassword = await ForgotPassword.findOne({ email, otp });
  console.log(forgotPassword);
  if (!forgotPassword) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  // Update user's password
  await User.updateOne({ email: email }, { password });
 
  forgotPassword.save()
  .then(() => res.send('password updated successfuly'))
  .catch(err => res.send('invalid one: ' + err));
});
 

module.exports = Router;