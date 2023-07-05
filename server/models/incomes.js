const mongoose = require('mongoose');
require('@b_kun/mongoose-currency').loadType(mongoose);
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: String,
        required: true
    }
    
});

module.exports = mongoose.model('Income', Income)