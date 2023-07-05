var express = require('express');
var incomeRouter = express.Router();
const bodyParser = require('body-parser');
const Incomes = require('../models/incomes');
const authenticate = require('../authenticate');

incomeRouter.use(bodyParser.json());

incomeRouter.route('/')
  .get(authenticate.verifyUser, (req, res, next) => {
    Incomes.find({ user: req.user.uid })
      .populate('category')
      .then((incomes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(incomes);
      }, (err) => next(err))
      .catch((err) => next(err));
  }
  )
  .post(authenticate.verifyUser, (req, res, next) => {
    req.body.user = req.user.uid;
    Incomes.create(req.body)
      .then((income) => {
        income.save()
          .then((income) => {
            Incomes.findById(income._id)
              .populate('category')
              .then((income) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(income);
              })
          })
      }, (err) => next(err))
      .catch((err) => next(err));
  }
  )
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /incomes');
  }
  )
  .delete(authenticate.verifyUser, (req, res, next) => {
    Incomes.remove({ user: req.user.uid })
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  }
  );

incomeRouter.route('/:incomeId')
  .get(authenticate.verifyUser, (req, res, next) => {
    Incomes.findById(req.params.incomeId)
      .populate('category')
      .then((income) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(income);
      }, (err) => next(err))
      .catch((err) => next(err));
  }
  )
  .put(authenticate.verifyUser, (req, res, next) => {
    Incomes.findByIdAndUpdate(req.params.incomeId, {
      $set: req.body
    }, { new: true })
      .then((income) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(income);
      }, (err) => next(err))
      .catch((err) => next(err));
  }
  )
  .delete(authenticate.verifyUser, (req, res, next) => {
    Incomes.findByIdAndRemove(req.params.incomeId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
  }
  );

module.exports = incomeRouter;