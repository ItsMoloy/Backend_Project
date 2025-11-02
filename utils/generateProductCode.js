const crypto = require('crypto');
const findLongestIncreasingSubstring = require('./findLongestIncreasingSubstring');

async function generateProductCode(productName) {
  try {
    // Hash the product name
    const hash = crypto.createHash('md5').update(productName).digest('hex').substring(0, 6);

    // Find longest increasing substrings
    const longestSubstrings = findLongestIncreasingSubstring(productName);

    if (longestSubstrings.length === 0) {
      return `${hash}-0${productName.charAt(0).toLowerCase()}0`;
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
    return `${hash}-${startIndex}${combinedSubstring}${endIndex}`;
  } catch (error) {
    throw error;
  }
}

module.exports = generateProductCode;