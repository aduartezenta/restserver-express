const express = require('express')
const app = express()
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const Category = require('../models/category')

// ==================
//  Load categories
// ==================
app.get('/category', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'firstName email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Category.count((err, count) => {
                res.json({
                    ok: true,
                    count,
                    categories
                })
            })
        })
})

// ==================
//  Load category
// ==================
app.get('/category/:id', verifyToken, (req, res) => {
    let id = req.params.id
    Category.findById(id, (err, category) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!category) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            category
        })
    })
})

// ==================
//  Create category
// ==================
app.post('/category', verifyToken, (req, res) => {
    let body = req.body
    let user = req.user

    let category = new Category({
        description: body.description,
        user
    })
    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

// ==================
//  Update category
// ==================
app.put('/category/:id', verifyToken, (req, res) => {
    let body = req.body
    let id = req.params.id
    let category = {
        description: body.description
    }
    Category.findByIdAndUpdate(id, category, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

// ==================
//  Delete category
// ==================
app.delete('/category/:id', verifyToken, [verifyAdminRole, verifyAdminRole], (req, res) => {
    let body = req.body
    let id = req.params.id
    Category.findByIdAndDelete(id, { useFindAndModif: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Category deleted'
        })
    })
})


module.exports = app