const { getIO } = require('./index');

/**
 * Emit event when a new product is created
 * All connected clients receive this notification
 */
const emitProductCreated = (product) => {
  const io = getIO();

  // Notify everyone (global feed)
  io.emit('product:created', {
    type: 'PRODUCT_CREATED',
    data: product,
    timestamp: new Date().toISOString(),
  });

  // Notify clients subscribed to this product's category
  if (product.categoryId) {
    io.to(`category:${product.categoryId}`).emit('category:new-product', {
      type: 'CATEGORY_NEW_PRODUCT',
      data: product,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Emit event when a product is updated
 */
const emitProductUpdated = (product) => {
  const io = getIO();

  io.emit('product:updated', {
    type: 'PRODUCT_UPDATED',
    data: product,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Emit event when a product is deleted
 */
const emitProductDeleted = (productId) => {
  const io = getIO();

  io.emit('product:deleted', {
    type: 'PRODUCT_DELETED',
    data: { id: productId },
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send a notification to a specific user
 */
const emitToUser = (userId, event, data) => {
  const io = getIO();

  io.to(`user:${userId}`).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send a notification to all admins
 */
const emitToAdmins = (event, data) => {
  const io = getIO();

  io.to('admins').emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  emitProductCreated,
  emitProductUpdated,
  emitProductDeleted,
  emitToUser,
  emitToAdmins,
};
