// Validation middleware for product creation and updates
exports.validateProduct = (req, res, next) => {
  const { name, description, price, discount, image, status, category } = req.body;
  const errors = [];

  // For create operation, check required fields
  if (req.method === 'POST') {
    if (!name) errors.push('Product name is required');
    if (!description) errors.push('Product description is required');
    if (price === undefined) errors.push('Product price is required');
    if (!image) errors.push('Product image URL is required');
    if (!category) errors.push('Product category is required');
  }

  // Validate price if provided
  if (price !== undefined && (isNaN(price) || price < 0)) {
    errors.push('Price must be a positive number');
  }

  // Validate discount if provided
  if (discount !== undefined && (isNaN(discount) || discount < 0 || discount > 100)) {
    errors.push('Discount must be a number between 0 and 100');
  }

  // Validate status if provided
  if (status && !['In Stock', 'Stock Out'].includes(status)) {
    errors.push('Status must be either "In Stock" or "Stock Out"');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};