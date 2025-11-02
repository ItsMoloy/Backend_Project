const Product = require('../models/Product');
const Category = require('../models/Category');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, image, status, category } = req.body;

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const product = new Product({
      name,
      description,
      price,
      discount,
      image,
      status,
      category
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products with optional filters
exports.getProducts = async (req, res) => {
  try {
    const { category, name, minPrice, maxPrice } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .select('-__v');

    // Calculate final price after discount
    const productsWithFinalPrice = products.map(product => {
      const productObj = product.toObject();
      productObj.finalPrice = product.finalPrice;
      return productObj;
    });

    res.json(productsWithFinalPrice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .select('-__v');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productObj = product.toObject();
    productObj.finalPrice = product.finalPrice;

    res.json(productObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { description, discount, status } = req.body;

    // Only allow updating specific fields
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (discount !== undefined) updateData.discount = discount;
    if (status !== undefined) updateData.status = status;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productObj = product.toObject();
    productObj.finalPrice = product.finalPrice;

    res.json(productObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};