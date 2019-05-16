const mongoose = require('mongoose');

const WoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    }
});

const Wood = mongoose.model('Wood', WoodSchema);

module.exports = { Wood };
