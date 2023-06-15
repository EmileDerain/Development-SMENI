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
                    .catch(error => res.status(400).json({error, message: 'Email already used !'}));
            }
        )
        .catch(error => res.status(500).json({error, message: 'Error while hashing password !'}));
};

exports.login = (req, res, next) => {
    console.log("req.body:", req.body);
    User.findOne({ mail: req.body.mail })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'The mail is incorrect' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'The credentials are incorrect' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET', //TODO : change this token to a more secure one later and the one in ../middleware/auth.js
                            { expiresIn: '24h' } //TODO : maybe more longer validity
                        )
                    });
                })
                .catch(error => res.status(500).json({ error , message: 'The credentials are incorrect'}));
        })
        .catch(error => res.status(500).json({ error , message: 'The email is incorrect'}));
};