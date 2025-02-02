const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    title: {
        type: String,
    },
    author: {
        type: String,
    },
    price: {
        type: Number,
    },
    category: {
        type: String,
    },
    publishYear: {
        type: String,
    }
});

const bookModel = mongoose.model('Book', bookSchema);
module.exports = bookModel;
