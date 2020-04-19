const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

let roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

let Scheme = mongoose.Schema

let userScheme = new Scheme({
    firstName: {
        type: String,
        required: [true, 'The first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'The last name is required']
    },
    email: {
        type: String,
        required: [true, 'The email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: roles
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        required: [true, 'The google is required'],
        default: false
    }
})

userScheme.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}
userScheme.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
});
module.exports = mongoose.model('User', userScheme)