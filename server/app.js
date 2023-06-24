var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const config = require("./config");
const mongoose = require("mongoose");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
const passport = require("passport");
require('dotenv').config({path:__dirname+'/../.env'});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var googleRouter = require("./routes/googleAuthRouter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// additional code

// connect db
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then(
    (db) => {
        console.log("Connected correctly to server");
    },
    (err) => {
        console.log(err);
    }
);

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: "session-id",
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new FileStore({ logFn: function () { } }),
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("12345-67890"));

// end of additional code

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("//auth/google", googleRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
