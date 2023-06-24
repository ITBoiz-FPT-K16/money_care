var express = require("express");
var userRouter = express.Router();
const bodyParser = require("body-parser");
var User = require("../models/users");
userRouter.use(bodyParser.json());
var passport = require("passport");
var authenticate = require("../authenticate");

userRouter.post("/signup", (req, res, next) => {
    if (req.body.email == null || req.body.password == null) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: "Email and password required" });
        return;
    }
    User.register(
        new User({ username: req.body.email }),
        req.body.password,
        (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.json({ err: err });
            } else {
                user.email = req.body.email;
                if (req.body.firstname) user.firstname = req.body.firstname;
                if (req.body.lastname) user.lastname = req.body.lastname;
                user.save()
                    .then((user) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json({ success: true, status: "Registration Successful!" });
                        return;
                    })
                    .catch((err) => {
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.json({ err: err });
                        return;
                    })
            }
        }
    );
});

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
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
