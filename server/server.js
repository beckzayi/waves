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

app.post('/api/users/login', async (req, res) => {
    // 1. find the email
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.json({
            loginSuccess: false,
            message: 'Auth fails, email not found'
        });
    }

    // 2. check password
    user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
            return res.json({
                loginSuccess: false,
                message: 'Auth fails, wrong password'
            });
        }

        // 3. generate a token
        user.generateToken((err, user) => {
            if (err) {
                return res.status(400).send(err);
            }
            res.cookie('token', user.token).status(200).json({
               loginSuccess: true,
               token: user.token     
            });
        });
    });
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});