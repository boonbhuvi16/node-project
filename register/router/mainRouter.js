const express = require('express');
const http = require('http');
var request = require('superagent');
const Router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/emailDB', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// define a schema for user data

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);
var mailchimpInstance   = 'us10',
    listUniqueId        = 'c7f13abae3',
    mailchimpApiKey     = '52e129790d7da323abfcbdb066b89434-us10';

Router.get('/', function (req, res){

    res.render('register');
})

Router.post('/register', function (req, res){
    
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  // save the user instance to database
  user.save()
    .then(() => res.send('Signup successful!'))
    .catch(err => res.send('Signup failed: ' + err));
 })

module.exports = Router;