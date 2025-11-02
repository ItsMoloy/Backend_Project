const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validation');

// Create a new category
router.post('/', validateCategory, categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getCategories);

// Get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// Update category
router.put('/:id', validateCategory, categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;