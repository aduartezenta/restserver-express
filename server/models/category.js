const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let Scheme = mongoose.Schema

let categorySchema = new Scheme({
    description: {
        type: String,
        required: [true, 'The description is required'],
        unique: true
    },
    user: {
        type: Scheme.Types.ObjectId,
        ref: 'User',
        required: [true, 'The user is required']
    }
})

categorySchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});

module.exports = mongoose.model('Category', categorySchema)