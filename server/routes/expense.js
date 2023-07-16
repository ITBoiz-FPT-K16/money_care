var express = require("express");
var expenseRouter = express.Router();
const bodyParser = require("body-parser");
const Expenses = require("../models/expenses");
const Categories = require("../models/categories");
const authenticate = require("../authenticate");

expenseRouter.use(bodyParser.json());

expenseRouter
    .route("/")
    .get(authenticate.verifyUser, (req, res, next) => {
        Expenses.find({ user: req.user.uid })
            .populate("category")
            .then(
                (expenses) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(expenses);
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
                if (category == null || category.type != false) {
                    var err = new Error("Category is not valid");
                    err.status = 400;
                    return next(err);
                }
            });
        Expenses.create(data)
            .then(
                (expense) => {
                    expense.save().then((expense) => {
                        Expenses.findById(expense._id)
                            .populate("category")
                            .then((expense) => {
                                res.statusCode = 200;
                                res.setHeader(
                                    "Content-Type",
                                    "application/json"
                                );
                                res.json(expense);
                            });
                    });
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /expenses");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Expenses.remove({ user: req.user.uid })
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

expenseRouter
    .route("/:expenseId")
    .get(authenticate.verifyUser, (req, res, next) => {
        Expenses.findById(req.params.expenseId)
            .populate("category")
            .then(
                (expense) => {
                    if (expense != null) {
                        if (expense.user === req.user.uid) {
                            res.statusCode = 200;
                            res.setHeader(
                                "Content-Type",
                                "application/json"
                            );
                            res.json(expense);
                        } else {
                            var err = new Error(
                                "You are not authorized to view this expense!"
                            );
                            err.status = 403;
                            return next(err);
                        }
                    } else {
                        err = new Error(
                            "Expense " +
                            req.params.expenseId +
                            " not found!"
                        );
                        err.status = 404;
                        return next(err);
                    }
                },
                (err) => next(err)
            )
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(
            "POST operation not supported on /expenses/" + req.params.expenseId
        );
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
                if (category == null || category.type != false) {
                    var err = new Error("Category is not valid");
                    err.status = 400;
                    return next(err);
                }
            });

        // check if the user is the owner of the expense
        Expenses.findById(req.params.expenseId).then((expense) => {
            if (expense == null) {
                var err = new Error(
                    "Expense " + req.params.expenseId + " not found!"
                );
                err.status = 404;
                return next(err);
            } else
            if (expense.user === req.user.uid) {
                Expenses.findByIdAndUpdate(
                    req.params.expenseId,
                    { $set: data },
                    { new: true }
                )
                    .then(
                        (expense) => {
                            Expenses.findById(expense._id)
                                .populate("category")
                                .then((expense) => {
                                    res.statusCode = 200;
                                    res.setHeader(
                                        "Content-Type",
                                        "application/json"
                                    );
                                    res.json(expense);
                                });
                        },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
            } else {
                var err = new Error(
                    "You are not authorized to update this expense!"
                );
                err.status = 403;
                return next(err);
            }
        });
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        // check if the user is the owner of the expense
        Expenses.findById(req.params.expenseId).then((expense) => {
            if (expense.user === req.user.uid) {
                Expenses.findByIdAndRemove(req.params.expenseId)
                    .then(
                        (resp) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(resp);
                        },
                        (err) => next(err)
                    )
                    .catch((err) => next(err));
            } else {
                var err = new Error(
                    "You are not authorized to delete this expense!"
                );
                err.status = 403;
                return next(err);
            }
        });
    });

module.exports = expenseRouter;
