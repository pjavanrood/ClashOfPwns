const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    hashedPassword: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('Data', dataSchema)