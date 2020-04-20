const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

app.post('/login', (req, res) => {
    let body = req.body

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Check if user exist
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User and password incorrect 1'
                }
            })
        }

        // Check passwords matches
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User and password incorrect 2'
                }
            })
        }

        // Create token
        let token = jwt.sign({
            user: userDB
        }, process.env.AUTH_SEED, { expiresIn: process.env.TOKEN_EXP_TIME });

        res.json({
            ok: true,
            user: userDB,
            token
        })
    })


})



module.exports = app