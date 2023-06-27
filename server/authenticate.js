var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var config = require('./config.js');
require('dotenv').config({ path: __dirname + '/../.env' });
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI
    }, (profile, done) => {
        if (profile.emails[0].value) {
            User.findOne({ email: profile.emails[0].value })
                .then((existingUser) => {
                    if (existingUser) {
                        done(null, existingUser);
                    } else {
                        new User({
                            email: profile.emails[0].value,
                            firstname: profile.name.familyName,
                            lastname: profile.name.givenName
                        })
                            .save()
                            .then(user => done(null, user));
                    }
                })
        }
    }));


exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey,
        { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id })
            .then((user) => {
                if (user) return done(null, user);
                return done(null, false);
            })
            .catch((err) => {
                return done(err, false);
            })
    }));



exports.verifyUser =
    passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next();
    }
    else {
        var err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
}

