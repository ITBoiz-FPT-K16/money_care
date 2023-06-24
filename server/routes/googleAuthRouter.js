var express = require("express");
var googleRouter = express.Router();
const bodyParser = require("body-parser");
var User = require("../models/users");
googleRouter.use(bodyParser.json());
var passport = require("passport");

googleRouter.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

googleRouter.get('/callback', passport.authenticate('google'), (req, res) => {
    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
        success: true,
        token: token,
        status: "You are successfully logged in!",
    });

});





module.exports = googleRouter;

