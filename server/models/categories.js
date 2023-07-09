const mongoose = require('mongoose');
require('@b_kun/mongoose-currency').loadType(mongoose);
const Schema = mongoose.Schema;

var Category = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Category', Category);