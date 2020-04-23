const express = require('express');
const fileUpload = require('express-fileupload');
const { verifyToken } = require('../middlewares/authentication')
const User = require('../models/user')
const Product = require('../models/product')
const fs = require('fs')
const path = require('path')

let app = express();

app.use(fileUpload());

app.put('/upload/:type/:id', verifyToken, (req, res) => {
    let type = req.params.type
    let id = req.params.id

    // Validate empty file
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded'
            }
        })
    }

    // Validate types
    let allowedTypes = ['products', 'users']
    if (allowedTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Type not allowed. Valid types are ${allowedTypes.join(', ')}`,
                type
            }
        })
    }

    // Validate extensions
    let file = req.files.file;
    let splittedFileName = file.name.split('.')
    let extension = splittedFileName[splittedFileName.length - 1]
    let allowedExtensions = ['png', 'jpg', 'gif', 'jpeg']
    if (allowedExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Files extension not allowed. Valid extensions are ${allowedExtensions.join(', ')}`,
                ext: extension
            }
        })
    }

    // Changes file name
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Upload file
    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        switch (type) {
            case 'products':
                findProductAndUpdate(id, type, fileName, res)
                break
            case 'users':
                findUserAndUpdate(id, type, fileName, res)
                break
        }

    });
})

function deleteFile(type, fileName) {
    let filePath = path.resolve(__dirname, `../../uploads/${type}/${fileName}`)
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
}

function findUserAndUpdate(id, type, fileName, res) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(type, fileName)
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            deleteFile(type, fileName)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            })
        }

        // Delete old file
        deleteFile(type, userDB.img)

        // Update with the new one
        userDB.img = fileName
        userDB.save((err, req) => {
            res.json({
                ok: true,
                user: userDB,
            })
        })
    })
}

function findProductAndUpdate(id, type, fileName, res) {
    Product.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(type, fileName)
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            deleteFile(type, fileName)
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            })
        }

        // Delete old file
        deleteFile(type, productDB.img)

        // Update with the new one
        productDB.img = fileName
        productDB.save((err, req) => {
            res.json({
                ok: true,
                user: productDB,
            })
        })
    })
}

module.exports = app