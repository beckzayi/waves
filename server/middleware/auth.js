const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    // check token
    const token = req.cookies.token;

    // verify the token
    jwt.verify(token, process.env.SECRET, async function(err, decode){
        const user = await User.findOne({
            _id: decode,
            token
        });

        if (err) {
            throw err;
        }

        if (!user) {
            return res.json({
                isAuth: false,
                error: true
            });
        }

        req.token = token;
        req.user = user;
        next();
    })
};

module.exports = { auth };
