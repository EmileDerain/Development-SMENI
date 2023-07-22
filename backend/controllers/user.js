const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require("../CNN/config/config");
const Admin = require("../models/admin");
const Audio = require("../models/audio");
const Model = require("../models/model");

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
                        type: "doctor",
                        userId: user._id,
                        token: jwt.sign({
                                userId: user._id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                mail: user.mail,
                            }, 'RANDOM_TOKEN_SECRET_DOCTOR', //TODO : change this token to a more secure one later and the one in ../middleware/authDoctor.js
                            {expiresIn: '24h'} //TODO : maybe more longer validity
                        ),
                        message: 'Connexion successful',
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

exports.getUserFilterBySection = async (req, res) => {
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


exports.patchMail = (req, res) => {
    const user = {
        mail: req.body.mail,
    };

    User.findByIdAndUpdate(
        req.auth.userId,
        {$set: user},
    ).then(updatedModel => {
        if (updatedModel) {
            console.log("User updated:", updatedModel);
            res.status(201).json({message: 'User updated, the changes will be effective at your next login.'});
        } else {
            console.log("No matching user found:", updatedModel);
            res.status(400).json({message: 'No matching user found'});
        }
    }).catch(error => {
        console.error("Error updating : ", error);
        res.status(400).json({message: "Error updating", error});
    });
};

exports.patchPassword = (req, res) => {

    bcrypt.hash(req.body.password, 10)
        .then(
            hash => {
                const user = {
                    password: hash,
                };

                User.findByIdAndUpdate(
                    req.auth.userId,
                    {$set: user},
                ).then(updatedModel => {
                    if (updatedModel) {
                        console.log("User updated:", updatedModel);
                        res.status(201).json({message: 'User updated, the changes will be effective at your next login.'});
                    } else {
                        console.log("No matching doctor found:", updatedModel);
                        res.status(400).json({message: 'No matching doctor found'});
                    }
                }).catch(error => {
                    console.error("Error updating : ", error);
                    res.status(400).json({message: "Error updating", error});
                });
            }
        )
        .catch(error => {
            console.log('catch', error)
            res.status(500).json({error, message: 'Error while hashing password !'})
        });
};


exports.patchMailAdministration = (req, res) => {
    const id = req.body._id;

    const user = {
        mail: req.body.mail,
    };

    User.findByIdAndUpdate(
        id,
        {$set: user},
    ).then(updatedModel => {
        if (updatedModel) {
            console.log("User updated:", updatedModel);
            res.status(201).json({message: 'User updated.'});
        } else {
            console.log("No matching user found:", updatedModel);
            res.status(400).json({message: 'No matching user found'});
        }
    }).catch(error => {
        console.error("Error updating : ", error);
        res.status(400).json({message: "Error updating", error});
    });
};

exports.patchPasswordAdministration = (req, res) => {
    const id = req.body._id;

    bcrypt.hash(req.body.password, 10)
        .then(
            hash => {
                const user = {
                    password: hash,
                };

                User.findByIdAndUpdate(
                    id,
                    {$set: user},
                ).then(updatedModel => {
                    if (updatedModel) {
                        console.log("User updated:", updatedModel);
                        res.status(201).json({message: 'User updated.'});
                    } else {
                        console.log("No matching user found:", updatedModel);
                        res.status(400).json({message: 'No matching user found'});
                    }
                }).catch(error => {
                    console.error("Error updating : ", error);
                    res.status(400).json({message: "Error updating", error});
                });
            }
        )
        .catch(error => {
            console.log('catch', error)
            res.status(500).json({error, message: 'Error while hashing password !'})
        });
};

exports.deleteDoctor = (req, res) => {
    const {id} = req.query;

    User.findByIdAndDelete(id)
        .then(() => res.status(200).json({message: 'Doctor delete !'}))
        .catch(error => res.status(400).json({error}));
};


exports.init100User = async (req, res) => {

    const firstName = ["Ai Vân", "Bich Thuy", "Công Minh", "Chi Tài", "Duyên", "Giang Long", "Lam"]
    const lastName = ["Nguyen", "Tran", "Le", "Pham", "Vu", "Ngo", "Do", "Hoang", "Dao", "Dang", "Duong", "Dinh"]

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 12; j++) {

            bcrypt.hash("password", 10)
                .then(hash => {
                    const user = new User({
                        firstName: firstName[i],
                        lastName: lastName[j],
                        mail: firstName[i].replace(" ", "") + lastName[j] + '@gmail.com',
                        password: hash,
                    });
                    user.save()
                        .then((u) => console.log('User ' + (i + 1) + j + ' created !'))
                        .catch(error => console.log('Email is already used !'));
                })
                .catch(error => console.log('Error while hashing password !'));
        }
    }
}
