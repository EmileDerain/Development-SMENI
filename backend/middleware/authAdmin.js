const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); ////TODO : change this token to a more secure one later and the one in ../controllers/admin.js
        const adminId = decodedToken.adminId;
        req.auth = {
            adminId: adminId
        };
        next();
    } catch(error) {
        res.status(401).json({ error, message: 'Error while authenticating admin !'});
    }
};