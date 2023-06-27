var express = require('express');
var expenseRouter = express.Router();
const bodyParser = require('body-parser');
const { Expenses } = require('../models/expenses');
const authenticate = require('../authenticate');

expenseRouter.use(bodyParser.json());

expenseRouter.route('/')
  .get(authenticate.verifyUser, (req, res, next) => {
    Expenses.find({ user: req.user._id })
      .populate('category')
      .then((expenses) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(expenses);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Expenses.create(req.body)
      .then((expense) => {
        expense.user = req.user._id;
        expense.save()
          .then((expense) => {
            Expenses.findById(expense._id)
              .populate('category')
              .then((expense) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(expense);
              })
          })
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /expenses');
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Expenses.remove({ user: req.user._id })
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

expenseRouter.route('/:expenseId')
  .get(authenticate.verifyUser, (req, res, next) => {
    Expenses.findById(req.params.expenseId)
      .populate('category')
      .then((expense) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(expense);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /expenses/' + req.params.expenseId);

  })
  .put(authenticate.verifyUser, (req, res, next) => {
    // check if the user is the owner of the expense
    Expenses.findById(req.params.expenseId)
      .then((expense) => {
        if (expense.user.equals(req.user._id)) {
          Expenses.findByIdAndUpdate(req.params.expenseId, {
            $set: req.body
          }, { new: true })
            .then((expense) => {
              Expenses.findById(expense._id)
                .populate('category')
                .then((expense) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(expense);
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        }
      })
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    // check if the user is the owner of the expense
    Expenses.findById(req.params.expenseId)
      .then((expense) => {
        if (expense.user.equals(req.user._id)) {
          Expenses.findByIdAndRemove(req.params.expenseId)
            .then((resp) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
          var err = new Error('You are not authorized to delete this expense!');
          err.status = 403;
          return next(err);
        }
      })
  });

module.exports = expenseRouter;
