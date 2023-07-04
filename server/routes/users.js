var express = require("express");
var userRouter = express.Router();
const bodyParser = require("body-parser");
var User = require("../models/users");
userRouter.use(bodyParser.json());
var passport = require("passport");
var authenticate = require("../authenticate");

const admin = require('firebase-admin');
var serviceAccount = require("../../key/serviceAccountKey.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

userRouter.post("/login", async (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: false, status: "Email or Password not provided" });
        return;
    }

    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
        const userResponse = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password,
            emailVerified: false,
            displayName: req.body.firstname + " " + req.body.lastname,
            disabled: false
        });
        console.log(userResponse);
        await User.create({
            email: req.body.email,
            username: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            admin: req.body.admin
        }).then((user) => {
            user.save();
        }
        , (err) => next(err))
        .catch((err) => next(err));

            
    }
    const userRecord = await admin.auth().getUserByEmail(req.body.email)
    User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
        var token = authenticate.getToken({ _id: user._id });
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({
            success: true,
            token: token,
            status: "You are successfully logged in!",
            userRecord: userRecord
        });
    }
    })
    .catch((error) => {
        console.log('Error fetching user data:', error);
    });
});

userRouter.get("/logout", (req, res, next) => {
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
                console.log(error);
            }
        });
        res.clearCookie("session-id");
        res.redirect("/");
    } else {
        var err = new Error("You are not logged in!");
        err.status = 403;
        next(err);
    }
});

module.exports = userRouter;
