const jwt = require('jsonwebtoken');

// Verify token
let verifyToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token, process.env.AUTH_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            })
        }
        req.user = decoded.user
        next()
    })
}

// Verify image token
let verifyImgToken = (req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.AUTH_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            })
        }
        req.user = decoded.user
        next()
    })
}

// Verify admin role
let verifyAdminRole = (req, res, next) => {
    let role = req.user.role
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User is not admin'
            }
        })
    }

    next()
}

module.exports = {
    verifyToken,
    verifyImgToken,
    verifyAdminRole
}