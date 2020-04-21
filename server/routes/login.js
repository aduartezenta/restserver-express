const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('../models/user')

let createToken = (user) => {
    return jwt.sign({
        user
    }, process.env.AUTH_SEED, { expiresIn: process.env.TOKEN_EXP_TIME })
}

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
                    message: 'User and password incorrect'
                }
            })
        }

        // Check passwords matches
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User and password incorrect'
                }
            })
        }

        res.json({
            ok: true,
            user: userDB,
            token: createToken(userDB)
        })
    })
})


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    // Verify token
    let token = req.body.idtoken
    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: {
                    message: 'Unauthorized'
                }
            })
        })

    // Check if user exist in our DB
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (userDB) {
            if (!userDB.google) {
                // User exist but is not a google user
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You must sign in regularly'
                    }
                })
            } else {
                // User exist and is a google user, create token
                res.json({
                    ok: true,
                    user: userDB,
                    token: createToken(userDB)
                })
            }
        } else {
            // User doesn't exist, create it
            let user = new User({
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                img: googleUser.img,
                email: googleUser.email,
                password: 'GOOGLE_PASSWORD',
                google: true
            })
            user.save((err, userDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    user: userDB
                })
            })
        }
    })
})

module.exports = app