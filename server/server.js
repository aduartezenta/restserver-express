require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

// Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require('./routes/index'))

mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err
    console.log('BD OK');
});


const port = process.env.PORT
app.listen(port, () => console.log(`Listening at port ${port}`))