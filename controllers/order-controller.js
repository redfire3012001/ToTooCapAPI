const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const User = require("../models/User");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
require("dotenv").config();

const getAllOrder = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "order_date";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const status = req.query.status;
    const userId = req.query.userId;

    let query = {};
    if (status) {
      query.status = status;
    }
    if (userId) {
      query.user_id = userId;
    }

    const skip = (currentPage - 1) * limit;
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allOrders = await Order.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Orders fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalOrders: totalOrders,
      data: allOrders,
    });
    // const allCarts = await Cart.find({});
    // res.status(200).json({
    //   success: true,
    //   message: "List of Carts fetched successfully",
    //   data: allCarts,
    // });
  } catch (e) {
    next(e);
  }
};

const getSingleOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    next(e);
  }
};

const addNewOrder = async (req, res, next) => {
  try {
    const { user_id, order_date, shipping_address, payment_method } = req.body;

    // validating user input
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User with the current ID is not found! Please try with a different ID",
      });
    }
    const cart = await Cart.findOne({ user_id: user_id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart with the current userId is not found! Please try with a different ID",
      });
    }
    const cartItems = await CartItem.find({ cart_id: cart._id });
    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Please add items to cart.",
      });
    }

    //convert cartItems to orderItems data and get total_amount from cartItems
    let total_amount = 0;
    const orderItems = [];
    for (const item of cartItems) {
      total_amount += item.unit_price * item.quantity;
      const orderItem = {
        quantity: item.quantity,
        unit_price: item.unit_price,
      };
      if (item.product_id) {
        orderItem.product_id = item.product_id;
      } else if (item.custom_design_id) {
        orderItem.custom_design_id = item.custom_design_id;
      }
      orderItems.push(orderItem);
    }

    //create new order from input and total amount
    const newOrder = await Order.create({
      user_id,
      order_date,
      status: "Processing",
      total_amount,
      shipping_address,
      payment_method,
    });

    //create new orderItems from orderItem data
    const savedOrderItems = [];
    for (const orderItem of orderItems) {
      orderItem.order_id = newOrder._id;
      const createdOrderItem = await OrderItem.create(orderItem);
      savedOrderItems.push(createdOrderItem);
    }

    //delete cart items after creating order
    await CartItem.deleteMany({ cart_id: cart._id });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
      orderItems: savedOrderItems,
    });
  } catch (e) {
    next(e);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { order_date, status, shipping_address, payment_method } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { order_date, status, shipping_address, payment_method },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        message: "Order is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (e) {
    next(e);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order is not found with this ID",
      });
    }

    await OrderItem.find({ order_id: orderId });

    res.status(200).json({
      success: true,
      order: deletedOrder,
    });
  } catch (e) {
    next(e);
  }
};

const getAllOrderItems = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const orderId = req.query.orderId;

    let query = {};
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        console.log("order not found!");
      } else {
        query.order_id = orderId;
      }
    }

    const skip = (currentPage - 1) * limit;
    const totalOrdersItems = await OrderItem.countDocuments(query);
    const totalPages = Math.ceil(totalOrdersItems / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allOrderItems = await OrderItem.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Orders Items fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalOrdersItems: totalOrdersItems,
      data: allOrderItems,
    });
    // const allCarts = await Cart.find({});
    // res.status(200).json({
    //   success: true,
    //   message: "List of Carts fetched successfully",
    //   data: allCarts,
    // });
  } catch (e) {
    next(e);
  }
};

const getSingleOrderItem = async (req, res, next) => {
  try {
    const orderItemId = req.params.id;
    const orderItem = await OrderItem.findById(orderItemId);

    if (!orderItem) {
      return res.status(404).json({
        success: false,
        message:
          "OrderItem with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: orderItem,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllOrder,
  getSingleOrder,
  addNewOrder,
  updateOrder,
  deleteOrder,
  getAllOrderItems,
  getSingleOrderItem,
};
