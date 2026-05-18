const ApiError = require('../../utils/ApiError');
const Category = require('./category.model');

class CategoryService {
  async create(data) {
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
      throw new ApiError(400, 'Category already exists');
    }
    return Category.create(data);
  }

  async getAll() {
    return Category.find().sort({ name: 1 });
  }

  async getById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async update(id, data) {
    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  async delete(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }
}

module.exports = new CategoryService();
