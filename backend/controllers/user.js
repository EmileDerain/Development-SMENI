const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require("../CNN/config/config");

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                firstName: req.body.firstName, lastName: req.body.lastName, mail: req.body.mail, password: hash,
            });
            user.save()
                .then(() => res.status(201).json({message: 'User created !'}))
                .catch(error => res.status(400).json({message: 'Email is already used !'}));
        })
        .catch(error => res.status(500).json({error, message: 'Error while hashing password !'}));
};

exports.login = (req, res) => {
    User.findOne({mail: req.body.mail})
        .then(user => {
            if (!user) {
                return res.status(401).json({message: 'The mail is incorrect'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({message: 'The credentials are incorrect'});
                    }
                    res.status(200).json({
                        userId: user._id, token: jwt.sign({
                                userId: user._id, firstName: user.firstName, lastName: user.lastName,
                            }, 'RANDOM_TOKEN_SECRET', //TODO : change this token to a more secure one later and the one in ../middleware/authDoctor.js
                            {expiresIn: '24h'} //TODO : maybe more longer validity
                        ), message: 'Connexion successful',
                    });
                })
                .catch(error => res.status(500).json({error, message: 'The credentials are incorrect'}));
        })
        .catch(error => res.status(500).json({error, message: 'The email is incorrect'}));
};

exports.getAllUser = (req, res) => {
    User.find()
        .then(users => res.status(200).json({"users": users, message: 'All the users have been retrieved'}))
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the users'}));
};

exports.getAllUserLabels = (req, res) => {
    User.find().select('lastName firstName _id').sort('labelName')
        .then(users => {
            const modifiedUsers = users.map(user => {
                return {
                    _id: user._id,
                    labelName: user.lastName + ' ' + user.firstName,
                };
            });
            res.status(200).json({labels: modifiedUsers, message: 'All the users have been retrieved'});
        })
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the users'}));
};


exports.getAllUserLabelsFilter = async (req, res) => {
    const sectionSize = config.sizeOfSection;
    const {page} = req.query;

    console.log("req.body.filter", req.body.filter);

    [lastName, firstName] = req.body.filter.split(' ');

    let orConditionsLastName;
    let orConditionsFirstName;

    if (lastName !== undefined) {
        const regexLastName = new RegExp(`\\b${lastName}`, "i");
        orConditionsLastName = [{lastName: {$regex: regexLastName}}, {firstName: {$regex: regexLastName}}];
    } else {
        orConditionsLastName = [{}]
    }

    if (firstName !== undefined) {
        const regexFirstName = new RegExp(`\\b${firstName}`, "i");
        orConditionsFirstName = [{lastName: {$regex: regexFirstName}}, {firstName: {$regex: regexFirstName}}];
    } else {
        orConditionsFirstName = [{}]
    }

    const count = await User.find({
        $and: [
            {$or: orConditionsLastName},
            {$or: orConditionsFirstName},
        ]
    }).countDocuments();

    User.find({
        $and: [
            {$or: orConditionsLastName},
            {$or: orConditionsFirstName},
        ]
    }).skip((page - 1) * sectionSize)
        .limit(sectionSize)
        .select('lastName firstName _id')
        .sort('labelName')
        .then(users => {
            const modifiedUsers = users.map(user => {
                return {
                    "_id": user._id,
                    "labelName": user.lastName + ' ' + user.firstName,
                };
            });
            res.status(200).json({
                labels: modifiedUsers,
                "count": Math.ceil(count / sectionSize),
                message: 'All the users have been retrieved'
            });
        })
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the users'}));
};

exports.getAllUserFilter = async (req, res) => {
    const sectionSize = config.sizeOfSection;
    const {page} = req.query;

    console.log("req.body.filter", req.body.filter);

    [lastName, firstName] = req.body.filter.split(' ');

    let orConditionsLastName;
    let orConditionsFirstName;

    if (lastName !== undefined) {
        const regexLastName = new RegExp(`\\b${lastName}`, "i");
        orConditionsLastName = [{lastName: {$regex: regexLastName}}, {firstName: {$regex: regexLastName}}];
    } else {
        orConditionsLastName = [{}]
    }

    if (firstName !== undefined) {
        const regexFirstName = new RegExp(`\\b${firstName}`, "i");
        orConditionsFirstName = [{lastName: {$regex: regexFirstName}}, {firstName: {$regex: regexFirstName}}];
    } else {
        orConditionsFirstName = [{}]
    }

    const count = await User.find({
        $and: [
            {$or: orConditionsLastName},
            {$or: orConditionsFirstName},
        ]
    }).countDocuments();

    User.find({
        $and: [
            {$or: orConditionsLastName},
            {$or: orConditionsFirstName},
        ]
    }).skip((page - 1) * sectionSize)
        .limit(sectionSize)
        .select('lastName firstName mail _id')
        .sort('lastName')
        .then(users => {
            res.status(200).json({
                labels: users,
                "count": Math.ceil(count / sectionSize),
                message: 'All the users have been retrieved'
            });
        })
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the users'}));
};
