const mongoose = require('mongoose');
require('@b_kun/mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

var Expense = new Schema({
    amount: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Expense', Expense)

