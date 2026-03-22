const mongoose = require('mongoose');

const expense = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        required:true,
        type: String,
        enum: ['food', 'transport', 'travel', 'healthcare', 'education', 'other']
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    todo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo',
    }

});

module.exports = mongoose.model('Expence', expense)