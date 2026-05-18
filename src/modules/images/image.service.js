const fs = require('fs');
const path = require('path');
const ApiError = require('../../utils/ApiError');
const Image = require('./image.model');
const Product = require('../products/product.model');

class ImageService {
  async upload(files, productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const images = await Promise.all(
      files.map((file) =>
        Image.create({
          url: `/${file.path.replace(/\\/g, '/')}`,
          productId,
        })
      )
    );

    const imageIds = images.map((img) => img._id);
    await Product.findByIdAndUpdate(productId, {
      $push: { images: { $each: imageIds } },
    });

    return images;
  }

  async getByProduct(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return Image.find({ productId });
  }

  async delete(imageId) {
    const image = await Image.findById(imageId);
    if (!image) {
      throw new ApiError(404, 'Image not found');
    }

    // Remove file from disk
    const filePath = path.join(process.cwd(), image.url.slice(1));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove reference from product
    await Product.findByIdAndUpdate(image.productId, {
      $pull: { images: image._id },
    });

    await Image.findByIdAndDelete(imageId);
    return image;
  }
}

module.exports = new ImageService();
