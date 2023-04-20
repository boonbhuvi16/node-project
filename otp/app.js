var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const mainRouter = require('./router/mainRouter');
 app.use('/',mainRouter);
 app.set('view engine','ejs')
 app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || 3000;

app.listen(port,()=> {
    console.log(`listing on port ${port}`);
});