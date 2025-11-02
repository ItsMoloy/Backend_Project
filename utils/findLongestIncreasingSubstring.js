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

module.exports = findLongestIncreasingSubstring;