const express  =  require('express')
const mongoose = require('mongoose')
const User = require('./models/ApiModel')
const app = express()
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//routes

app.get('/', (req, res) => {
    res.send('Hello NODE API')
})

app.get('/blog', (req, res) => {
    res.send('CRUD RESTAPI')
})

// app.get('/users', async(req, res) => {
//     try {
//         const user= await User.find({});
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// })
app.get('/users', async (req, res) => {
    try {
        const { email } = req.query; // Extract email from query parameter
        let user;

        if (email) {
            // If email query parameter is present, find user by email
            user = await User.find({ email });
        } else {
            // If email query parameter is not present, find all users
            user= await User.find({});
        }

        // If no user is found
        if (!user) {
            return res.status(404).json({ message: 'Cannot find any users' });
        }

        res.status(200).json(user);
    } catch (error) {
        // Handle any errors that occur during the database query
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/users/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


app.post('/users', async(req, res) => {
   
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);

}
    catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
   
})

// update a user
app.put('/users/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { body } = req;
        const user = await User.findOneAndUpdate({ name }, body, { new: true });
        
        // If no user is found
        if (!user) {
            return res.status(404).json({ message: `Cannot find any user with name ${name}` });
        }

        res.status(200).json(user);
    } catch (error) {
        // Handle any errors that occur during the update process
        res.status(500).json({ message: 'Internal server error' });
    }
});


// delete a user

app.delete('/users/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message: `cannot find any user with ID ${id}`})
        }
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

  
mongoose.set("strictQuery", false)
mongoose.connect('mongodb://127.0.0.1:27017/emailDB', 
                      {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('connected to MongoDB')
    app.listen(3000, ()=> {
        console.log(`Node API app is running on port 3000`)
    });
}).catch((error) => {
    console.log(error)
})