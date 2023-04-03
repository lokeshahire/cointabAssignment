const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/User.model");

userRouter.post("/signup", async (req, res) => {
  const { name, email, pass } = req.body;

  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.send({ msg: "user registration failed", error: err.message });
      } else {
        const user = new UserModel({ name, email, pass: hash });
        await user.save();
        res.send({ msg: "registration successful" });
      }
    });
  } catch (e) {
    res.send({ msg: "user registration failed", error: e.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    const now = new Date();
    const blockExpires1 = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (new Date() > user.blockExpires) {
      user.status = "active";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status == "blocked") {
      return res.status(403).json({
        message: "Account Blocked",
      });
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.pass);

    if (!isPasswordMatch) {
      user.failedAttempts += 1;

      await user.save();

      if (user.failedAttempts >= 5) {
        user.status = "blocked";
        user.blockExpires = blockExpires1;
        await user.save();
        return res.status(403).json({
          message: "Account Blocked",
        });
      } else {
        return res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      // Successful login

      user.failedAttempts = 0;
      await user.save();
      const token = jwt.sign({ id: user._id }, "masai");
      res.status(200).json({ token, email });
    }
  } catch (e) {
    res.send({ msg: "user registration failed", error: e.message });
  }
});

module.exports = { userRouter };
