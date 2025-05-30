const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const ApplyMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ message: "Api Key Are Missing", success:"false", error:"false" });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    const secret = process.env.SECERATE_KEY;

    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: "Failed authentication" });
        } else {
            req.id = decoded.id;
            next();
        }
    });
};




module.exports = ApplyMiddleware;
