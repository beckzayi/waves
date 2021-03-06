const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');

// Models
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');

// Routes
app.get('/', (req, res) => {
    res.status(200);
    res.send({ msg: 'Hello World' });
});

// ========================
//          USERS
// ========================

app.get('/api/users/auth', auth, (req, res) => {
    const { email, name, lastname, role, cart, history } = req.user;
    res.status(200).json({
        // user: req.user
        isAdmin: role === 0 ? false : true,
        isAuth: true,
        email,
        name,
        lastname,
        role,
        cart,
        history
    });
});

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
            // userdata: doc
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

app.get('/api/user/logout', auth, async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.user._id },
            { token: '' }    
        );

        if (!user) {
            return res.json({
                success: false,
                error: 'User not found'
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            error: err
        }); 
    }

    return res.status(200).send({ success: true });
});

// ========================
//          BRANDS
// ========================

app.post('/api/product/brand', auth, admin, async (req, res) => {
    const brand = await new Brand({
        name: req.body.name
    }).save();

    res.status(200).json({
        success: true,
        brand
    });
});

app.get('/api/product/brands', async (req, res) => {
    const brands = await Brand.find({});
    res.status(200).send(brands);
});

// ========================
//          BRANDS
// ========================

app.post('/api/product/wood', auth, admin, async (req, res) => {
    const wood = await new Wood({
        name: req.body.name        
    }).save();

    res.status(200).json({
        success: true,
        wood
    });
});

app.get('/api/product/woods', async (req, res) => {
    const woods = await Wood.find({});
    res.status(200).send(woods);
});

// ========================
//          PRODUCTS
// ========================

app.post('/api/product/article', auth, admin, async (req, res) => {
    const product = await new Product(req.body).save();

    res.status(200).json({
        success: true,
        article: product
    });
});

app.get('/api/product/article/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
                            .populate('brand')
                            .populate('wood');

    // Query multiple products
    // items = ids.map(item => mongoose.Types.ObjectId(item));
    // Product.find({ _id: { $in: items } });

    res.status(200).send(product);
});

// By ARRIVAL /articles?sortBy=createdAt&order=desc&limit=4
// By SOLD
app.get('/api/product/articles', async (req, res) => {
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const order = req.query.order || 'desc';
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    const products = await Product.find()
                        .populate('brand')
                        .populate('wood')
                        .sort({ [sortBy]: order })
                        .limit(limit);

    res.status(200).send(products);
});


const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
