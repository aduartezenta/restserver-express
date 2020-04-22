const express = require('express')
const app = express()
const { verifyToken } = require('../middlewares/authentication')
const Product = require('../models/product')
const Category = require('../models/category')

// ==================
//  Load products
// ==================
app.get('/product', verifyToken, (req, res) => {
    let from = Number(req.query.from) || 0
    let limit = Number(req.query.limit) || 5
    let condition = {
        available: true
    }
    Product.find(condition)
        .populate('user', 'firstName')
        .populate('category', 'description')
        .skip(from)
        .limit(limit)
        .sort('name')
        .exec(async(err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!products) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            let count = await Product.count(condition)
            res.json({
                ok: true,
                count,
                products
            })
        })
})

// ==================
//  Load product
// ==================
app.get('/product/:id', verifyToken, (req, res) => {
    let id = req.params.id
    Product.findById(id)
        .populate('user', 'firstName')
        .populate('category', 'description')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!product) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                product
            })
        })
})

// ==================
//  Search product
// ==================
app.get('/product/search/:query', verifyToken, (req, res) => {
    let query = req.params.query
    let regex = new RegExp(query, 'i')
    Product.find({ name: regex })
        .populate('user', 'firstName')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!products) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                products
            })
        })
})

// ==================
//  Add product
// ==================
app.post('/product', verifyToken, (req, res) => {
    let user = req.user
    let body = req.body
        /*
        // Example
        // Find random category
        let count = await Category.count().exec()
        let random = Math.floor(Math.random() * count)
        let category = await Category.findOne().skip(random)
        */
    let product = new Product({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        category: body.category,
        user
    })

    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            product: productDB
        })
    })
})

// ==================
//  Update product
// ==================
app.put('/product/:id', verifyToken, async(req, res) => {
    let id = req.params.id
    let body = req.body
    let product = {
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
    }
    Product.findByIdAndUpdate(id, product, { new: true, runValidators: true, context: 'query' }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            })
        }

        res.json({
            ok: true,
            product
        })
    })
})

// ==================
//  Delete product
// ==================
app.delete('/product/:id', verifyToken, async(req, res) => {
    let id = req.params.id
    let product = {
        available: false
    }
    Product.findByIdAndUpdate(id, product, { new: true, runValidators: true, context: 'query' }, (err, product) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!product) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            })
        }

        res.json({
            ok: true,
            product
        })
    })
})

module.exports = app