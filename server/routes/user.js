const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const _ = require("underscore")
const User = require('../models/user')

app.get('/user', verifyToken, function(req, res) {
    let from = Number(req.query.from) || 0
    let limit = Number(req.query.limit) || 5

    let condition = {
        status: true
    }
    User.find(condition, 'firstName lastName email status role')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.count(condition, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    users
                })
            })
        })
})
app.post('/user', [verifyToken, verifyAdminRole], function(req, res) {
    let body = req.body
    let user = new User({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
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
})
app.put('/user/:id', [verifyToken, verifyAdminRole], function(req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['firstName', 'lastName', 'email', 'img', 'role', 'status'])

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
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
})
app.delete('/user/:id', [verifyToken, verifyAdminRole], function(req, res) {
    let id = req.params.id

    let changesStatus = {
        status: false
    }
    User.findByIdAndUpdate(id, changesStatus, { new: true }, (err, userDB) => {
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
})

module.exports = app