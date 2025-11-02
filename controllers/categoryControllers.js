const Category = require('../models/Category');
const Product = require('../models/Product');

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new Category({
      name,
      description
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select('-__v');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
