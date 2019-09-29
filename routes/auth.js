const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validation')

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
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(err)
    }
});

module.exports = router;

//have to run this command to use joi.validate
//npm uninstall --save @hapi/joi
//npm install--save @hapi/joi@15.0.3
