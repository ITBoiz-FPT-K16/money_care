const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;

var Income = new Schema({
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
    
});

module.exports = {
    Incomes : mongoose.model('Income', Income),
    IncomeSchema : Income
}