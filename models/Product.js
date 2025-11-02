const mongoose = require('mongoose');
const crypto = require('crypto');

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

// Function to find the longest strictly increasing substring
function findLongestIncreasingSubstring(str) {
  str = str.toLowerCase();
  let maxLength = 0;
  let maxSubstrings = [];

  for (let i = 0; i < str.length; i++) {
    let currentSubstring = str[i];
    let currentChar = str.charCodeAt(i);

    for (let j = i + 1; j < str.length; j++) {
      const nextChar = str.charCodeAt(j);
      if (nextChar > currentChar) {
        currentSubstring += str[j];
        currentChar = nextChar;
      } else {
        break;
      }
    }

    if (currentSubstring.length > maxLength) {
      maxLength = currentSubstring.length;
      maxSubstrings = [{ substring: currentSubstring, startIndex: i, endIndex: i + currentSubstring.length - 1 }];
    } else if (currentSubstring.length === maxLength && maxLength > 0) {
      maxSubstrings.push({ substring: currentSubstring, startIndex: i, endIndex: i + currentSubstring.length - 1 });
    }
  }

  return maxSubstrings;
}

// Generate product code
productSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    return next();
  }

  try {
    // Hash the product name
    const hash = crypto.createHash('md5').update(this.name).digest('hex').substring(0, 6);

    // Find longest increasing substrings
    const longestSubstrings = findLongestIncreasingSubstring(this.name);

    if (longestSubstrings.length === 0) {
      this.productCode = `${hash}-0${this.name.charAt(0).toLowerCase()}0`;
      return next();
    }

    // Concatenate all substrings of equal max length
    let combinedSubstring = '';
    let startIndex = longestSubstrings[0].startIndex;
    let endIndex = longestSubstrings[0].endIndex;

    longestSubstrings.forEach(item => {
      combinedSubstring += item.substring;
      endIndex = Math.max(endIndex, item.endIndex);
    });

    // Generate the product code
    this.productCode = `${hash}-${startIndex}${combinedSubstring}${endIndex}`;

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