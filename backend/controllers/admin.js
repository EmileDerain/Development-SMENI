const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    Admin.findOne({mail: req.body.mail})
        .then(admin => {
            if (!admin) {
                return res.status(401).json({message: 'The mail is incorrect'});
            }
            bcrypt.compare(req.body.password, admin.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({message: 'The credentials are incorrect'});
                    }
                    res.status(200).json({
                        type: "admin",
                        adminId: admin._id,
                        token: jwt.sign(
                            {
                                adminId: admin._id,
                                mail: admin.mail,
                            },
                            'RANDOM_TOKEN_SECRET_ADMIN', //TODO : change this token to a more secure one later and the one in ../middleware/authAdmin.js
                            {expiresIn: '24h'} //TODO : maybe more longer validity
                        )
                    });
                })
                .catch(error => res.status(500).json({error, message: 'The credentials are incorrect'}));
        })
        .catch(error => res.status(500).json({error, message: 'The email is incorrect'}));
};


exports.patchMail = (req, res) => {

    const admin = {
        mail: req.body.mail,
    };

    Admin.findByIdAndUpdate(
        req.auth.adminId,
        {$set: admin},
    ).then(updatedModel => {
        if (updatedModel) {
            console.log("Admin updated:", updatedModel);
            res.status(201).json({message: 'Admin updated, the changes will be effective at your next login.'});
        } else {
            console.log("No matching admin found:", updatedModel);
            res.status(400).json({message: 'No matching admin found'});
        }
    }).catch(error => {
        console.error("Error updating : ", error);
        res.status(400).json({message: "Error updating", error});
    });
};

exports.patchPassword = (req, res) => {
    console.log("pass:", req.body.password, req.auth.adminId)

    bcrypt.hash(req.body.password, 10)
        .then(
            hash => {
                const admin = {
                    password: hash,
                };

                Admin.findByIdAndUpdate(
                    req.auth.adminId,
                    {$set: admin},
                ).then(updatedModel => {
                    if (updatedModel) {
                        console.log("Admin updated:", updatedModel);
                        res.status(201).json({message: 'Admin updated, the changes will be effective at your next login.'});
                    } else {
                        console.log("No matching admin found:", updatedModel);
                        res.status(400).json({message: 'No matching admin found'});
                    }
                }).catch(error => {
                    console.error("Error updating : ", error);
                    res.status(400).json({message: "Error updating", error});
                });
            }
        )
        .catch(error => {
            console.log('catch', error)
            res.status(500).json({error, message: 'Error while hashing password !'})});
};

