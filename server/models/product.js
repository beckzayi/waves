const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 100000
    },
    price: {
        type: Number,
        required: true,
        maxlength: 255
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand', // the model in db
        required: true
    },
    wood: {
        type: Schema.Types.ObjectId,
        ref: 'Wood',
        required: true
    },
    shipping: {
        type: Boolean,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    frets: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    publish: {
        type: Boolean,
        required: true
    },
    images: {
        type: Array,
        default: []
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };
