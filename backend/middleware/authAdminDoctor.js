const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, 'RANDOM_TOKEN_SECRET_DOCTOR', (err, decoded) => {
        if (!err) {
            const userId = decoded.userId;
            req.auth = {
                userId: userId
            };
            console.log("RANDOM_TOKEN_SECRET_DOCTOR OK")
            next();
        } else {
            jwt.verify(token, 'RANDOM_TOKEN_SECRET_ADMIN', (err, decoded) => {
                if (!err) {
                    const adminId = decoded.adminId;
                    req.auth = {
                        adminId: adminId
                    };
                    console.log("RANDOM_TOKEN_SECRET_ADMIN OK")
                    next();
                } else {
                    res.status(401).json({err, message: 'Error while authenticating !'});
                }

            });
        }
    });
}
