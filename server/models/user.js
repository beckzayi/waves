const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

const User = mongoose.model('User', UserSchema);

module.exports = { User };
