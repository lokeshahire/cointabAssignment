
const express = require('express');
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require('../models/User.model');


userRouter.post("/signup", async (req, res) => {

    const { name, email, pass } = req.body


    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            if (err) {
                res.send({ msg: "user registration failed", "error": err.message });
            }
            else {
                const user = new UserModel({ name, email, pass: hash });
                await user.save();
                res.send({ msg: "user registration successful" });
            }
        });

    } catch (e) {
        res.send({ msg: "user registration failed", "error": e.message });
    }
});



userRouter.post("/login", async (req, res) => {

    const { email, pass } = req.body;

    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {

            bcrypt.compare(pass, user[0].pass, (err, result) => {

                if (result) {

                    let token = jwt.sign({ userID: user[0]._id }, "masai")

                    res.send({ msg: "Login Succsess", "token": token });
                }
                else {
                    res.send({ msg: "user registration failed" });

                }
            });

        }
        else {
            res.send({ msg: "wrong Credentials" })
        }
    } catch (e) {
        res.send({ msg: "user registration failed", "error": e.message });

    }
});

module.exports = { userRouter }



