// Port
process.env.PORT = process.env.PORT || 8080

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Database
let mongoDBURI

if (process.env.NODE_ENV === 'dev') {
    mongoDBURI = 'mongodb://localhost:27017/coffee'
} else {
    mongoDBURI = process.env.MONGO_DB_URI
}
process.env.URL_DB = mongoDBURI