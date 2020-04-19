// Port
process.env.PORT = process.env.PORT || 8080

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Database
let urlBD

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/coffee'
} else {
    urlBD = 'mongodb+srv://admin:xAkxQnrYJLfR6afo@cluster0-yynrr.mongodb.net/coffee'
}
process.env.URL_DB = urlBD