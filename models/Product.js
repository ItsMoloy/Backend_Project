const mongoose = require('mongoose');
const crypto = require('crypto');
const findLongestIncreasingSubstring = require('../utils/findLongestIncreasingSubstring');
const generateProductCode = require('../utils/generateProductCode');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['In Stock', 'Stock Out'],
    default: 'In Stock'
  },
  productCode: {
    type: String,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, { timestamps: true });

// Generate product code
productSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    return next();
  }

  try {
    this.productCode = await generateProductCode(this.name);
    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function() {
  return this.price - (this.price * this.discount / 100);
});

// Include virtuals when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);