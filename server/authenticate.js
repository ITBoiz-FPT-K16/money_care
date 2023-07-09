require('dotenv').config({ path: __dirname + '/../.env' });

const admin = require('firebase-admin');
const serviceAccount = require('../key/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.verifyUser = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            var err = new Error("Token not found!");
            err.status = 403;
            return next(err);
        }
        const idToken = req.headers.authorization.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        var err = new Error("You are not authenticated!");
        err.status = 403;
        return next(err);
    }
}

exports.firebase = admin;

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

