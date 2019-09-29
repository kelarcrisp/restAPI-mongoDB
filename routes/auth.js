//use this router method always, then export module.exports = router, this allows both of these functions to be exported
const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation')

//this has to be async because it takes a second to pull this information fronm the DB
router.post('/register', async (req, res) => {

    // validate the data before we make a user, which we do in validaton.js
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    //checking if the user is already in the database, findone is a built in function to do so
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('Email already exists')

    //HASH THE PASSWORD generate a salt and hash the password with this salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Create a new user as long as the two conditions above arent met
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    //always put any sort of async call to a DB or API in a try/catch block
    try {
        const savedUser = await user.save();
        //this now returns only the user id instead of the only user object
        res.send({ user: user._id })
    } catch (err) {
        res.status(400).send(err)
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    //checking if the user already exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email or password is wrong');

    //check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("invalid password");

    //CREATE and assign a token this will take two parameters an id, and a secret
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    //this will now send a JWT token as a header
    res.header('auth-token', token).send(token);

})

module.exports = router;
//find out where the user ID is even coming from
//have to run this command to use joi.validate
//npm uninstall --save @hapi/joi
//npm install--save @hapi/joi@15.0.3
