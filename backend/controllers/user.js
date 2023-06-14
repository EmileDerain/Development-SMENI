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
                    .catch(error => res.status(400).json({error, message: 'User already exist !'}));
            }
        )
        .catch(error => res.status(500).json({error, message: 'Error while hashing password !'}));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'The email is incorrect' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'The credentials are incorrect' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    });
                })
                .catch(error => res.status(500).json({ error , message: 'The credentials are incorrect'}));
        })
        .catch(error => res.status(500).json({ error , message: 'The email is incorrect'}));
};