const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express();
var cookieParser = require('cookie-parser');

//DB Config
const db  = require('./config/keys').mongoURI;

//Connection to MongoDB
mongoose.connect(db, {newUrlParser: true})
	.then(()=>console.log('Database Connected'))
	.catch(err=>console.log(`Database Connection Failed: ${err}`));

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'));
app.use('/post', require('./routes/post'));

app.listen(5000, ()=>{
	console.log("Server Running on 5000")
})

