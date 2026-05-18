const ApiError = require('../../utils/ApiError');
const Product = require('./product.model');
const Category = require('../categories/category.model');

class ProductService {
  async create(data, userId) {
    const category = await Category.findById(data.categoryId);
    if (!category) {
      throw new ApiError(400, 'Category not found');
    }

    const product = await Product.create({ ...data, createdBy: userId });
    return product.populate(['categoryId', 'images']);
  }

  async getAll(query = {}) {
    const { page = 1, limit = 10, category, search, minPrice, maxPrice, sort } = query;

    const filter = {};

    if (category) {
      filter.categoryId = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortOrder = sort.startsWith('-') ? -1 : 1;
      sortOption = { [sortField]: sortOrder };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('categoryId', 'name slug')
        .populate('images', 'url')
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id) {
    const product = await Product.findById(id)
      .populate('categoryId', 'name slug')
      .populate('images', 'url')
      .populate('createdBy', 'name email');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async update(id, data) {
    if (data.categoryId) {
      const category = await Category.findById(data.categoryId);
      if (!category) {
        throw new ApiError(400, 'Category not found');
      }
    }

    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate('categoryId', 'name slug')
      .populate('images', 'url');

    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async delete(id) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }
}

module.exports = new ProductService();
