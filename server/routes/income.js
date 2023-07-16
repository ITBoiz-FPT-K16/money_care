var express = require("express");
var incomeRouter = express.Router();
const bodyParser = require("body-parser");
const Incomes = require("../models/incomes");
const Categories = require("../models/categories");
const authenticate = require("../authenticate");

incomeRouter.use(bodyParser.json());

incomeRouter
    .route("/")
    .get(authenticate.verifyUser, (req, res, next) => {
        Incomes.find({ user: req.user.uid })
            .populate("category")
            .then(
                (incomes) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(incomes);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        let data = {};
        if (req.body.category) {
            data.category = req.body.category;
        }
        if (req.body.amount) {
            data.amount = req.body.amount;
        }
        if (req.body.date) {
            data.date = req.body.date;
        }
        if (req.body.description) {
            data.description = req.body.description;
        }
        data.user = req.user.uid;
        Categories.findById(data.category)
            .then((category) => {
                if (category == null || category.type != true) {
                    var err = new Error("Category is not valid");
                    err.status = 400;
                    return next(err);
                }
            })
        Incomes.create(data)
            .then(
                (income) => {
                    income.save().then((income) => {
                        Incomes.findById(income._id)
                            .populate("category")
                            .then((income) => {
                                res.statusCode = 200;
                                res.setHeader(
                                    "Content-Type",
                                    "application/json"
                                );
                                res.json(income);
                            });
                    });
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /incomes");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Incomes.remove({ user: req.user.uid })
            .then(
                (resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(resp);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    });

incomeRouter
    .route("/:incomeId")
    .get(authenticate.verifyUser, (req, res, next) => {
        Incomes.findById(req.params.incomeId)
            .populate("category")
            .then(
                (income) => {
                    if (income == null) {
                        var err = new Error("Income not found");
                        err.status = 404;
                        return next(err);
                    }
                    if (income.user != req.user.uid) {
                        var err = new Error(
                            "You are not authorized to perform this operation!"
                        );
                        err.status = 403;
                        return next(err);
                    }
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(income);
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        let data = {};
        if (req.body.category) {
            data.category = req.body.category;
        }
        if (req.body.amount) {
            data.amount = req.body.amount;
        }
        if (req.body.date) {
            data.date = req.body.date;
        }
        if (req.body.description) {
            data.description = req.body.description;
        }
        data.user = req.user.uid;

        Categories.findById(data.category)
            .then((category) => {
                if (category == null || category.type != true) {
                    var err = new Error("Category is not valid");
                    err.status = 400;
                    return next(err);
                }
            })
        // check user before update
        Incomes.findById(req.params.incomeId)
            .then((income) => {
                if (income == null) {
                    var err = new Error("Income not found");
                    err.status = 404;
                    return next(err);
                }
                if (income.user != req.user.uid) {
                    var err = new Error(
                        "You are not authorized to perform this operation!"
                    );
                    err.status = 403;
                    return next(err);
                }
                Incomes.findByIdAndUpdate(
                    req.params.incomeId,
                    {
                        $set: data,
                    },
                    { new: true }
                )
                    .then(
                        (income) => {
                            res.statusCode = 200;
                            res.setHeader(
                                "Content-Type",
                                "application/json"
                            );
                            res.json(income);
                        },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Incomes.findById(req.params.incomeId)
            .then((income) => {
                if (income.user != req.user.uid) {
                    var err = new Error(
                        "You are not authorized to perform this operation!"
                    );
                    err.status = 403;
                    return next(err);
                }
                Incomes.findByIdAndRemove(req.params.incomeId)
                    .then(
                        (resp) => {
                            res.statusCode = 200;
                            res.setHeader(
                                "Content-Type",
                                "application/json"
                            );
                            res.json(resp);
                        },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
            })
            .catch((err) => next(err));
    });


module.exports = incomeRouter;
