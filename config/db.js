const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bookStore');

const db = mongoose.connection;

db.on('error', (error) => {
    console.error("Database connection error:", error);
});

db.once('open', () => {
    console.log('Database Connected Successfully');
});

module.exports = db;
