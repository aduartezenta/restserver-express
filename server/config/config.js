// Port
process.env.PORT = process.env.PORT || 8080

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Token expiration time
// 60 seconds
// 60 minutes
// 24 hours
// 30 days
process.env.TOKEN_EXP_TIME = 60 * 60 * 24 * 30

// Authentication Seed
process.env.AUTH_SEED = process.env.AUTH_SEED || 'auth-seed-dev'

// Database
let mongoDBURI

if (process.env.NODE_ENV === 'dev') {
    mongoDBURI = 'mongodb://localhost:27017/coffee'
} else {
    mongoDBURI = process.env.MONGO_DB_URI
}
process.env.URL_DB = mongoDBURI

// Google Client ID
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '1013020105268-fsleuv0ruo1tfd2jc7fm7uu11c1p9k5t.apps.googleusercontent.com'