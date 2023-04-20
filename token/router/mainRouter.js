const express = require('express');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://127.0.0.1:27017/JWT', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
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
    JWTtoken: {
        type: String,
        default: '',
      },
  });
  userSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  };
  const User = mongoose.model('User', userSchema);

  Router.get('/', function (req, res){

    res.render('login');
})

Router.get('/register', function (req, res){

    res.render('register');
})

  Router.post('/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      const existingUser = await User.findOne({ email });
        console.log(existingUser)
  if (existingUser) {
    return res.status(400).json({ error: 'Email address is already in use' });
  }
      const user = new User({ email, password });
      await user.save();
      console.log(user);
      res.json("User saved Sucessfully");
    } catch (err) {
        console.log(err)
      res.status(500).send('Error creating user');
    }
  });

  Router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      console.log(password);
     
      if (!user) return res.status(401).send('Invalid Username');
      if (password != user.password || user.password == null) return res.status(401).send('Invalid Password');
      
      const JWTtoken = jwt.sign({ email: user.email,password: user.password }, 'mysecretkey',{ expiresIn: '1h' });
      if(JWTtoken){
       console.log(JWTtoken)
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

  module.exports = Router;