const axios = require("axios");
const Profile = require('../database/models/Profile');
const Order = require('../database/models/Order');
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

module.exports = {
    getHomePage: (req, res) => {
        res.render("index.html");
    },
    getRegistrationPage: (req, res) => {
        res.render("/register");
    },
    postNewProfile: (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.session.error = errors.array();
            res.redirect("/register");
        } else {
            bcrypt
                .hash(req.body.password, 10)
                .then(hashPassword => {
                    // let newProfile = req.body;
                    console.log(req.body);
                    Profile.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hashPassword
                    })
                        .then((result) => {
                            res.send(result.dataValues) //sending to client
                        })
                })
                .catch(error => console.error(`Could not save user ${error.stack}`))
        }
    },
    loggedUser: (req, res) => {
        Profile
            .findOne({ where: { email: req.body.email } })
            .then(foundUser => {
                bcrypt
                    .compare(req.body.password, foundUser.dataValues.password)
                    .then(results => {
                        if (req.body.email !== null && results) {
                            req.session.user = foundUser.dataValues;
                            res.send(req.session.user);
                        } else {
                            console.log("Something went wrong when loggin in");
                            res.redirect("/login");
                        }
                    })
                    .catch(error => console.error(`Couldn't login: ${error.stack}`));
            })
            .catch(error => console.error(`Something went wrong when comparing password: ${error.stack}`));
    },
    postNewOrder: (req, res) => {
        let newOrder = req.body;

        Order.create({ nameClient: newOrder.nameClient, nameSo: newOrder.nameSo, service: newOrder.service, contactSo: newOrder.contactSo, situation: newOrder.situation, message: newOrder.message, orderExecuted: newOrder.orderExecuted, profileId: req.session.user.id })
            .then(results => {
                console.log(results.dataValues)
                res.send(results.dataValues)
            })
            .catch(error => console.error(`Could not save user ${error.stack}`))

    },
    getOrderFromDb: (req, res) => {
        Order.findAll({
            limit: 1,
            where: { profileId: req.session.user.id },
            order: [['createdAt', 'DESC']]
        })
            .then(allOrder => {
                res.send(allOrder[0].dataValues)
                // let order = allOrder.map(orderElement => {
                //     return {
                //         nameClient: orderElement.dataValues.nameClient,
                //         nameSo: orderElement.dataValues.nameSo
                //     }
                // })
                //res.send(order)
            })
            .catch(error => console.error(`Something went wrong when finding order ${error.stack}`))
    },
    logout: (req, res) => {
        if(req.session.user && req.cookies.userCookie){
            res.clearCookie("userCookie");
            res.redirect("/");
        } else {
            res.redirect("login");
        }
    }
}