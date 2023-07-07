var express = require("express");
var transactionRouter = express.Router();
const bodyParser = require("body-parser");
const Expenses = require("../models/expenses");
const Category = require("../models/categories");
const Incomes = require("../models/incomes");
const authenticate = require("../authenticate");

transactionRouter.use(bodyParser.json());

transactionRouter.get(
    "/:year/:month/overall",
    authenticate.verifyUser,
    async (req, res, next) => {
        try {
            var year = req.params.year;
            var month = req.params.month;
            var startDate = new Date(year, month - 1, 1);
            var endDate = new Date(year, month, 0);
            var query = {
                user: req.user.uid,
                date: { $gte: startDate, $lte: endDate },
            };
            let expenses = await Expenses.find(query).sort({ date: -1 }).exec();
            let incomes = await Incomes.find(query).sort({ date: -1 }).exec();
            let totalExpenses = 0;
            let totalIncomes = 0;

            for (let expense of expenses) {
                totalExpenses += expense.amount;
            }
            for (let income of incomes) {
                totalIncomes += income.amount;
            }
            // get All categories in database
            let categories = await Category.find({}).lean().exec();
            for (let category of categories) {
                for (let expense of expenses) {
                    if (category._id.equals(expense.category)) {
                        if (!category.expenses) {
                            category.expenses = [expense];
                        } else {
                            category.expenses.push(expense);
                        }
                    }
                }
                for (let income of incomes) {
                    if (category._id.equals(income.category)) {
                        if (!category.incomes) {
                            category.incomes = [income];
                        } else {
                            category.incomes.push(income);
                        }
                    }
                }
            }
            let categoryList = categories.filter((category) => {
                return category.expenses || category.incomes;
            });
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
                totalExpenses: totalExpenses,
                totalIncomes: totalIncomes,
                categories: categoryList,
                netIncome: totalIncomes - totalExpenses,
            });
        } catch (err) {
            next(err);
        }
    }
);

transactionRouter.get(
    "/total",
    authenticate.verifyUser,
    async (req, res, next) => {
        try {
            let expenses = await Expenses.find({ user: req.user.uid }).exec();
            let incomes = await Incomes.find({ user: req.user.uid }).exec();
            let total = 0;
            for (let expense of expenses) {
                total -= expense.amount;
            }
            for (let income of incomes) {
                total += income.amount;
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
                total: total,
            });
        } catch (err) {
            next(err);
        }
    }
);

transactionRouter.get(
    "/:year/:month/detail",
    authenticate.verifyUser,
    async (req, res, next) => {
        var year = req.params.year;
        var month = req.params.month;
        var startDate = new Date(year, month - 1, 1);
        var endDate = new Date(year, month, 0);
        let dateInMonth = [];
        let expenseList = [],
            incomeList = [];
        // generate object date list in dateInMonth
        for (let i = 1; i <= endDate.getDate(); i++) {
            dateInMonth.push({
                date: new Date(year, month - 1, i).toDateString(),
                totalExpenses: 0,
                totalIncomes: 0,
            });
        }

        var query = {
            user: req.user.uid,
            date: { $gte: startDate, $lte: endDate },
        };
        try {
            let expenses = await Expenses.find(query).populate("category");
            let incomes = await Incomes.find(query).populate("category");
            let totalExpenses = 0;
            let totalIncomes = 0;
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            for (let e of expenses) {
                totalExpenses += e.amount;
            }
            for (let i of incomes) {
                totalIncomes += i.amount;
            }

            for (let element of dateInMonth) {
                expenses.forEach((e) => {
                    if (e.date.toDateString() === element.date) {
                        element.totalExpenses += e.amount;
                    }
                    if (
                        expenseList.some((expense) =>
                            expense._id.equals(e.category._id)
                        )
                    ) {
                        expenseList.find((expense) =>
                            expense._id.equals(e.category._id)
                        ).total += e.amount;
                    } else {
                        expenseList.push(e.category);
                    }
                });
                incomes.forEach((i) => {
                    if (i.date.toDateString() === element.date) {
                        element.totalIncomes += i.amount;
                    }
                    if (
                        incomeList.some((income) =>
                            income._id.equals(i.category._id)
                        )
                    ) {
                        incomeList.find((income) =>
                            income._id.equals(i.category._id)
                        ).total += i.amount;
                    } else {
                        incomeList.push(i.category);
                    }
                });
            }

            res.json({
                totalExpenses: totalExpenses,
                totalIncomes: totalIncomes,
                dateInMonth: dateInMonth,
                expenseList: expenseList,
                incomeList: incomeList,
            });
        } catch (error) {
            next(error);
        }
    }
);

transactionRouter.get(
    "/:year/:month/:categoryId",
    authenticate.verifyUser,
    async (req, res, next) => {
        var year = req.params.year;
        var month = req.params.month;
        var categoryId = req.params.categoryId;
        var startDate = new Date(year, month - 1, 1);
        var endDate = new Date(year, month, 0);

        var query = {
            user: req.user.uid,
            date: { $gte: startDate, $lte: endDate },
            category: categoryId,
        };
        Category.findById(categoryId).then((category) => {
            if (!category) {
                var err = new Error("Category " + categoryId + " not found");
                err.status = 404;
                return next(err);
            }
            Expenses.find(query)
                .sort({ date: -1 })
                .then((expenses) => {
                    Incomes.find(query)
                        .sort({ date: -1 })
                        .then(
                            (incomes) => {
                                let total = 0;
                                for (let expense of expenses) {
                                    total += expense.amount;
                                }
                                for (let income of incomes) {
                                    total += income.amount;
                                }
                                res.statusCode = 200;
                                res.setHeader(
                                    "Content-Type",
                                    "application/json"
                                );
                                res.json({
                                    category: category,
                                    expenses: expenses,
                                    incomes: incomes,
                                    total: total,
                                });
                            },
                            (err) => next(err)
                        )
                        .catch((err) => next(err));
                });
        });
    }
);

module.exports = transactionRouter;
