const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');

const cardSchema = new mongoose.Schema({
    bizName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    bizDescription: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024
    },
    bizAddress: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 400
    },
    bizPhone: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10
    },
    bizImage: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 1024
    },
    bizNumber: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 9999999999,
        unique: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // 'ref' for reference
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Card = mongoose.model('Card', cardSchema);

async function generateRandomNumber(Card) {

    while (true) {
        let randomNumber = _.random(1000, 9999999999);
        let card = await Card.findOne({ bizNumber: randomNumber }); // check if there is in 'cards' collection a card that its 'bizNumber' is the randomNumber var
        if (!card) return String(randomNumber); // if there is no such number so the function return the randomNumber converted to string and stop the loop
    }
}

function validateCard(card) {

    const schema = Joi.object({
        bizName: Joi.string().min(2).max(255).required(),
        bizDescription: Joi.string().min(2).max(1024).required(),
        bizAddress: Joi.string().min(2).max(400).required(),
        bizPhone: Joi.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/),
        bizImage: Joi.string().min(11).max(1024)
    });

    return schema.validate(card);
}

exports.Card = Card;
exports.generateRandomNumber = generateRandomNumber;
exports.validateCard = validateCard;