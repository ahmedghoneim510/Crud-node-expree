const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

imageSchema.index({ productId: 1 });

module.exports = mongoose.model('Image', imageSchema);
