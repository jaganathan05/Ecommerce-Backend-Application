const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mrpprice: {
        type: Number,
        required: true
    },
    saleprice: {
        type: Number,
        required: true
    },
    offer: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    remainquantity: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    imageurl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Products', ProductSchema);
