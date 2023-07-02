var express = require('express');
var transactionRouter = express.Router();
const bodyParser = require('body-parser');
const { Expenses } = require('../models/expenses');
const Category = require('../models/categories');
const { Incomes } = require('../models/incomes')
const authenticate = require('../authenticate');

transactionRouter.use(bodyParser.json())

transactionRouter.get(":year/:month", authenticate.verifyUser, (req, res, next) => {
  var year = req.params.year;
  var month = req.params.month;
  var startDate = new Date(year, month - 1, 1);
  var endDate = new Date(year, month, 0);
  var query = { user: req.user._id, date: { $gte: startDate, $lte: endDate } };
  Expenses.find({ $query: { query }, $orderby: { date: -1 } })
    .then((expenses) => {
      Incomes.find({ $query: { query }, $orderby: { date: -1 } })
        .then((incomes) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');

          let totalExpenses = 0;
          let totalIncomes = 0;
          for (let expense of expenses) {
            totalExpenses += expense.amount;
          }
          for (let income of incomes) {
            totalIncomes += income.amount;
          }
          let total = totalIncomes - totalExpenses;
          // get All categories in database
          Category.find({})
            .then((categories) => {
              for (let category of categories) {
                for (let expense of expenses) {
                  if (category._id.equals(expense.category)) {
                    if (!category.expenses) {
                      category.expenses = [expense]
                    }
                    else {
                      category.expenses.push(expense)
                    }
                  }
                }
                for (let income of incomes) {
                  if (category._id.equals(income.category)) {
                    if (!category.incomes) {
                      category.incomes = [income]
                    }
                    else {
                      category.incomes.push(income)
                    }
                  }
                }
                let categoryList = categories.filter((category) => {
                  return category.expenses || category.incomes;
                })

                res.json({
                  totalExpenses: totalExpenses,
                  totalIncomes: totalIncomes,
                  categories: categoryList,
                  total: total
                });
              }
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    })
})