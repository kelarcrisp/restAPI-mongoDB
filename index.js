const express = require('express')
const app = express();
const dotenv = require('dotenv')
//makes the connection to mongoDB
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
dotenv.config();

//connect to DB
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true }
);

//Middleware
app.use(express.json());

//Routes Middleware
app.use('/api/user', authRoute);


app.listen(3000, () => console.log('server up and running'));



// -------- NOTES --------
 // express--use .get to just recieve info, .post() to send info. you will call this method on the variable you amde that is invoking express. theres also .delete(), and .patch(). the first parameter on each of this is just the route that you want this method to be invoked on. each of these will always come with a callback function as a second parameter that will take (req,res) 


 // MIDDLEWARE is just a function that runs when a specific route is hit. create this with .use() ---look into this more--


 //mongoDB -- mongoose makes conencting to a DB very easy. connect to DB with importing mongoose, and then call .connect('URL') on the mongoose variable you make. make sure to make an .env file to store the pass in. always test this connect with adding a second parameter with a call back fucntion that contains a console.log

