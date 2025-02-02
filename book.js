const express = require('express');
const fs = require('fs');
const bookModel = require('../BOOK-STORE-DETAILS/model/bookStore');
require('../BOOK-STORE-DETAILS/config/db');
const multer = require('multer');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use('/upload', express.static(path.join(__dirname, 'upload')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "upload/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.get('/', async (req, res) => {
    const books = await bookModel.find();
    res.render('bookStore', { books });
});

app.post('/bookData', upload.single("image"), async (req, res) => {

    const { title, author, price, category, publishedYear } = req.body;

    const image = req.file ? `/upload/${req.file.filename}` : '';
    await bookModel.create({
        image,
        title,
        author,
        price,
        category,
        publishYear: publishedYear
    });
    res.redirect('/');
});

app.get('/delete', async (req, res) => {
    const userId = req.query.id;
    const book = await bookModel.findById(userId);

    if (book && book.image) {
        const imagePath = path.join(__dirname, book.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    await bookModel.findByIdAndDelete(userId);
    res.redirect('/');
});

app.get('/edit', async (req, res) => {
    const userId = req.query.id;
    const book = await bookModel.findById(userId);
    res.render('editBook', { book });
});

app.post('/update', upload.single("image"), async (req, res) => {

    const userId = req.query.id;

    const { title, author, price, category, publishedYear } = req.body;

    const book = await bookModel.findById(userId);
    let image = book.image;

    if (req.file) {
        const oldImagePath = path.join(__dirname, 'upload', book.image);

        if (fs.existsSync(oldImagePath) && book.image) {
            fs.unlinkSync(oldImagePath);
        }

        image = `/upload/${req.file.filename}`;
    }

    await bookModel.findByIdAndUpdate(userId, {
        title,
        author,
        price,
        category,
        publishYear: publishedYear,
        image
    });

    res.redirect('/');
});


app.listen(7200, () => {
    console.log('Server is listening on port 7200');
});
