const express = require('express');
const fs = require('fs')
const path = require('path')
const { verifyImgToken } = require('../middlewares/authentication')

let app = express();

app.get('/image/:type/:img', verifyImgToken, (req, res) => {
    let type = req.params.type
    let img = req.params.img

    let imageFilePath = path.resolve(__dirname, `../../uploads/${type}/${img}`)
    if (!fs.existsSync(imageFilePath)) {
        let noImageFilePath = path.resolve(__dirname, '../assets/no-image.jpg')
        return res.sendFile(noImageFilePath)
    }

    return res.sendFile(imageFilePath)
})

module.exports = app