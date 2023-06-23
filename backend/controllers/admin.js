const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(
            hash => {
                const admin = new Admin({
                    mail: req.body.mail,
                    password: hash,
                });
                admin.save()
                    .then(() => res.status(201).json({message: 'Admin created !'}))
                    .catch(error => res.status(400).json({error, message: 'Email already used !'}));
            }
        )
        .catch(error => res.status(500).json({error, message: 'Error while hashing password !'}));
};

exports.login = (req, res, next) => {
    Admin.findOne({ mail: req.body.mail })
        .then(admin => {
            if (!admin) {
                return res.status(401).json({ message: 'The mail is incorrect' });
            }
            bcrypt.compare(req.body.password, admin.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'The credentials are incorrect' });
                    }
                    res.status(200).json({
                        adminId: admin._id,
                        token: jwt.sign(
                            { adminId: admin._id },
                            'RANDOM_TOKEN_SECRET', //TODO : change this token to a more secure one later and the one in ../middleware/authAdmin.js
                            { expiresIn: '24h' } //TODO : maybe more longer validity
                        )
                    });
                })
                .catch(error => res.status(500).json({ error , message: 'The credentials are incorrect'}));
        })
        .catch(error => res.status(500).json({ error , message: 'The email is incorrect'}));
};