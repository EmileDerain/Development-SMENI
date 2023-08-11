const bcrypt = require('bcrypt');
const Admin = require("../models/admin");
const Model = require("../models/model");
const fs = require("fs");

exports.init = () => {
    Admin.find()
        .then(admin => {
            if (admin.length === 0) {
                bcrypt.hash("admin", 10)
                    .then(
                        hash => {
                            const admin = new Admin({
                                mail: "admin@admin.com",
                                password: hash,
                            });
                            admin.save()
                                .then(() => console.log("Admin created"))
                                .catch(error => console.log("Error: ", error));
                        }
                    )
                    .catch(error => console.log("Error: ", error));
            }
        })

    Model.find()
        .then(async model => {
            if (model.length === 0) {

                //Not accurate values
                const model = new Model({
                    modelName: "Default",
                    path: './CNN/models/DefaultModel.h5',
                    date: new Date(2023, 5, 1),
                    loss: 0.01,
                    accuracy:0.9567,
                });

                model.save()
                    .then(defaultModel => {
                        console.log("Default model created");
                        const json = JSON.stringify(defaultModel, null, 2);
                        fs.writeFileSync('./CNN/config/selectedModel.json', json);
                    })
                    .catch(error => console.log("Error: ", error));
            }
        })
}
