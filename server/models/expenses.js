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
    image: {
        type: String,
        required: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
});


module.exports = {
    Expenses : mongoose.model('Expense', Expense),
    ExpenseSchema : Expense
}
