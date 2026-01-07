const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    name: {
      type: String,
      required: [true, 'Please provide a product name.'],
      trim: true,
    },
    image: {
      url:{
      type: String,
      default: 'https://via.placeholder.com/150', 
      },
      public_id: { 
      type: String,
      required: true,
    }
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description.'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category.'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price.'],
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports ={Product};