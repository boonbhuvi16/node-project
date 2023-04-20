const mongoose = require('mongoose')
const express  =  require('express')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a user name"]
    },
    mobile: {
        type: Number,
        required: true,
        default: 0
    },
    place: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },
    Password:
    {
        type: String,
        required:true,
    },
    
},

{
    timestamps: true
});

const crud = mongoose.model('crud', userSchema);


module.exports = crud;

    




