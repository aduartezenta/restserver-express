require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/user', function(req, res) {
    res.json('GET user')
})
app.post('/user', function(req, res) {
    let body = req.body

    if (body.firstName === undefined) {
        res.status(400).json({
            ok: false,
            message: 'First name is required'
        })
    } else {
        res.json({
            body
        })
    }
})
app.put('/user/:id', function(req, res) {
    let id = req.params.id

    res.json({
        id
    })
})
app.delete('/user', function(req, res) {
    res.json('DELETE user')
})


const port = process.env.PORT
app.listen(port, () => console.log(`Listening at port ${port}`))