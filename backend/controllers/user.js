const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(
            hash => {
                const user = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    mail: req.body.mail,
                    password: hash,
                });
                user.save()
                    .then(() => res.status(201).json({message: 'User created !'}))
                    .catch(error => res.status(400).json({error}));
            }
        )
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {

};