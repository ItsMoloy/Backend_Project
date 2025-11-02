const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validation');

// Create a new product
router.post('/', validateProduct, productController.createProduct);

// Get all products with optional filters
router.get('/', productController.getProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Update product
router.put('/:id', validateProduct, productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;