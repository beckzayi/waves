const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SALT_I = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 100
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    role: {
        type: Number,
        default: 0 // normal user
    },
    token: {
        type: String
    }
});

UserSchema.pre('save', function(next) {
    var user = this;

    // Make sure to generate hashed pw only when pw is updated
    if (user.isModified('password')) {
        bcrypt.genSalt(SALT_I, function(err, salt){
            if (err) {
                return next(err);
            }
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

UserSchema.methods.generateToken = async function(callback) {
    var user = this;
    var token = await jwt.sign(user._id.toHexString(), process.env.SECRET);

    user.token = token;

    user.save(function(err, user){
        if (err) {
            return callback(err);
        }
        callback(null, user);
    })
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
