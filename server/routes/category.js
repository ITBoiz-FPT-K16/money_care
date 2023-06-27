var express = require('express');
var categoryRouter = express.Router();
const bodyParser = require('body-parser');
const Category = require('../models/categories');
const authenticate = require('../authenticate');

categoryRouter.use(bodyParser.json());

categoryRouter.get('/', (req, res, next) => {
  Category.find()
    .then((categories) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(categories);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = categoryRouter;
