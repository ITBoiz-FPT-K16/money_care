var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ExpenseSchema = require('./expenses').ExpenseSchema;
var IncomeSchema = require('./incomes').IncomeSchema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    email: {
        type: String,
        default: ''
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    expenses: [ExpenseSchema],
    incomes: [IncomeSchema]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
