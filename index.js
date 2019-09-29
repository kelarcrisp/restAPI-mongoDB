const express = require('express')
const app = express();
const dotenv = require('dotenv')
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



