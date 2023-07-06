const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.initUsers = () => {
    User.find()
        .then(users => {
            if(users.length === 0) {
                bcrypt.hash("mdp", 10)
                    .then(hash => {
                        const user = new User({
                            firstName: "Tom", lastName: "Bevan", mail: "mail@mail.mail", password: hash,
                        });
                        user.save()
                            .then(() => console.log('Tom created !'))
                            .catch(error => console.log('Email is already used !'));
                    })
                    .catch(error => console.log('Error while hashing password !'));


            bcrypt.hash("mdp", 10)
                    .then(hash => {
                        const user = new User({
                            firstName: "Emile", lastName: "Derain", mail: "ed@gmail.com", password: hash,
                        });
                        user.save()
                            .then(() => console.log('Emile created !'))
                            .catch(error => console.log('Email is already used !'));
                    })
                .catch(error => console.log('Error while hashing password !'));

            bcrypt.hash("mdp", 10)
                .then(hash => {
                    const user = new User({
                        firstName: "Vinh", lastName: "Faucher", mail: "vinh@faucher.com", password: hash,
                    });
                    user.save()
                        .then(() => console.log('Vinh created !'))
                        .catch(error => console.log('Email is already used !'));
                })
                .catch(error => console.log('Error while hashing password !'));

            }})
        .catch(error => console.log('Error while retrieving all the users'));
}
