const express = require('express');
const mongoose = require('mongoose');
const bankController = require('./controllers/bankController');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello NODE API');
});

app.get('/blog', (req, res) => {
  res.send('CRUD RESTAPI');
});

app.get('/users', bankController.getUsers);
app.get('/users/:id', bankController.getUserById);
app.post('/users', bankController.createUser);
app.put('/users/:name', bankController.updateUserByName);
app.delete('/users/:id', bankController.deleteUserById);
app.post('/otherModel', bankController.otherModel);
app.get('/othermodel/:refid', bankController.getUserByrefId);
app.get('/users/accno/:accNo', bankController.getUserByAccNo);
app.delete('/users/accno/:accNo', bankController.delUserByAccNo);


mongoose
  .connect('mongodb://127.0.0.1:27017/emailDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
        console.log('Node API app is running on port 3000');
      });
    })
    .catch((error) => {
      console.log(error);
    });

