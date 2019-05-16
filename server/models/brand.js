const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    }
});

const Brand = mongoose.model('Brand', BrandSchema);

module.exports = { Brand };
