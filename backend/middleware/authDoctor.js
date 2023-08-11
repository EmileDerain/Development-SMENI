const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("MID Doctor");
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET_DOCTOR'); //TODO : change this token to a more secure one later and the one in ../controllers/user.js
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        console.log("error", error);
        res.status(401).json({error, message: 'Error while authenticating user !'});
    }
};
