const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user.js');
const bcrypt = require('bcrypt'); // hash passwords library
const _ = require('lodash');
const auth = require('../middleware/auth.js');

// check if the token from the user is valid
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password'); // select send all details exept the password. without it it will send all user's details
    res.send(user);
});

// if someone wants to send post request to 'localhost:3900/api/users', then...
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // validate that the email is unique
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already register');

    // encrypting the password with bcrypt
    user = new User(req.body);
    const salt = await bcrypt.genSalt(10); // number or string
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    //res.send(user); // never send the password!!!
    // res.send({_id: user._id, name: user.name, email: user.email}); // without lodash
    res.send(_.pick(user, ['_id', 'name', 'email'])); // with lodash

});

module.exports = router;