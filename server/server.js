const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Models
const { User } = require('./models/user');

// Routes
app.get('/', (req, res) => {
    res.status(200);
    res.send({ msg: 'Hello World' });
});

// ========================
//          USERS
// ========================
app.post('/api/users/register', async (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) {
            return res.json({
                success: false,
                err
            });
        }

        res.status(200).json({
            success: true,
            userdata: doc
        });
    });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
