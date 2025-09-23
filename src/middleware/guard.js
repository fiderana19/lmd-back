const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace("Bearer ","")
    
    if (!token) {
        return res.status(401).send({
        message: "Aucun jeton fourni !",
        });
    }

    try {
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).send({
            message: "Token invalide !",
        });
    }

}

module.exports = authMiddleware;