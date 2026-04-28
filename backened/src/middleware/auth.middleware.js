const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blackList.model")

// Common function for token validation to keep code DRY (Don't Repeat Yourself)
async function validateToken(req) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) return { error: "Unauthorized access, token is missing", status: 401 }

    const isBlacklisted = await tokenBlackListModel.findOne({ token })
    if (isBlacklisted) return { error: "Unauthorized access, token is invalid", status: 401 }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return { userId: decoded.userId }
    } catch (err) {
        return { error: "Unauthorized access, token is invalid", status: 401 }
    }
}

// 1. General Auth Middleware (For everyone)
async function authMiddleware(req, res, next) {
    const validation = await validateToken(req)
    if (validation.error) return res.status(validation.status).json({ message: validation.error })

    try {
        //  Yahan +systemUser add kiya hai taake har request mein pata chale user admin hai ya nahi
        const user = await userModel.findById(validation.userId).select("+systemUser")
        if (!user) return res.status(401).json({ message: "User not found" })

        req.user = user
        return next()
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// 2. Admin Only Middleware
async function authSystemUserMiddleware(req, res, next) {
    const validation = await validateToken(req)
    if (validation.error) return res.status(validation.status).json({ message: validation.error })

    try {
        const user = await userModel.findById(validation.userId).select("+systemUser")
        
        // 🛑 Safe Check: Pehle user check karo, phir uska systemUser status
        if (!user || !user.systemUser) {
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })
        }

        req.user = user
        return next()
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}