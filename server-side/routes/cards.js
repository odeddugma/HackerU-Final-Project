const express = require('express');
const _ = require('lodash');
const { Card, validateCard, generateRandomNumber } = require('../models/card');
const auth = require('../middleware/auth.js')
const router = express.Router();

// delete card
router.delete('/:id', auth, async (req, res) => {

    let card = await Card.findOneAndRemove({ _id: req.params.id, user_id: req.user._id });
    if (!card) return res.status(404).send('The card with the given ID is not found');

    res.send(card);
});


// put is for editing the card
router.put('/:id', auth, async (req, res) => {
    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let card = await Card.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, req.body);
    if (!card) return res.status(400).send('The card with the given ID is not found');

    card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
    res.send(card);
});

// if the server get a get req for a specific card. 'id' is a variable contains the card id.  it can be any name
router.get('/:id', auth, async (req, res) => {
    const card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
    if (!card) return res.status(404).send('The card with the given ID is not found');
    res.send(card);
});


//if the server get a post req to create a new card
router.post('/', auth, async (req, res) => {

    const { error } = validateCard(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // if there is no error then... create an object from Card
    let card = new Card({
        bizName: req.body.bizName,
        bizDescription: req.body.bizDescription,
        bizAddress: req.body.bizAddress,
        bizPhone: req.body.bizPhone,
        // if there is 'bizImage' in the 'req.body' use that. else use (default pic)
        bizImage: req.body.bizImage ? req.body.bizImage : 'http://cdn.pixabay.com/photo/2015/10/30/10/03/app-1013616_960_720.jpg',
        bizNumber: await generateRandomNumber(Card),
        user_id: req.user._id
    });

    // card abject was created from Card class that wes created with mongoose, therefor there is 'save' method in it.. 'save' method would do 'insert' to MongoDB 
    let post = await card.save();

    // withs the method 'save' we saved the object in the database. but we also saved the object in a variable called 'post'. we send 'post' back to the user.
    res.send(post);


});

module.exports = router;