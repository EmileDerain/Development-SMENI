const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("MID Admin");
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET_ADMIN'); //TODO : change this token to a more secure one later and the one in ../controllers/admin.js
        const adminId = decodedToken.adminId;
        req.auth = {
            adminId: adminId
        };
        next();
    } catch(error) {
        console.log("error", error);
        res.status(401).json({ error, message: 'Error while authenticating admin !'});
    }
};
