const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const User = require("../models/User");
const CustomDesign = require("../models/CustomDesign");
require("dotenv").config();

const getAllCart = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const searchTerm = req.query.searchTerm;

    const skip = (currentPage - 1) * limit;
    let query = {};
    if (searchTerm) {
      query = {
        $or: [
          { user_id: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }
    const ToTalCarts = await Cart.countDocuments(query);
    const totalPages = Math.ceil(ToTalCarts / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allCarts = await Cart.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Carts fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      ToTalCarts: ToTalCarts,
      data: allCarts,
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

const getSingleCart = async (req, res, next) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (e) {
    next(e);
  }
};

const addNewCart = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User with the current ID is not found! Please try with a different ID",
      });
    }

    const newCart = await Cart.create({
      user_id,
    });
    res.status(201).json({
      success: true,
      message: "Cart created successfully",
      data: newCart,
    });
  } catch (e) {
    next(e);
  }
};

const updateCart = async (req, res, next) => {
  try {
    const cartId = req.params.id;
    const { user_id } = req.body;
    if (user_id) {
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User with the current ID is not found! Please try with a different ID",
        });
      }
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { user_id },
      {
        new: true,
      }
    );
    if (!updatedCart) {
      res.status(404).json({
        success: false,
        message: "Cart is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: updatedCart,
    });
  } catch (e) {
    next(e);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const cartId = req.params.id;
    const deletedCart = await Cart.findByIdAndDelete(cartId);

    if (!deletedCart) {
      res.status(404).json({
        success: false,
        message: "Cart is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedCart,
    });
  } catch (e) {
    next(e);
  }
};

const getAllCartItemByCartId = async (req, res, next) => {
  try {
    const cartId = req.params.id;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "cart with the current ID is not found! Please try with a different ID",
      });
    }


    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const searchTerm = req.query.searchTerm;

    const skip = (currentPage - 1) * limit;
    // let query = {};
    // if (searchTerm) {
    //   query = {
    //     $or: [
    //       { user_id: { $regex: searchTerm, $options: "i" } },
    //       { email: { $regex: searchTerm, $options: "i" } },
    //     ],
    //   };
    // }
    const totalCartItems = await CartItem.countDocuments();
    const totalPages = Math.ceil(totalCartItems / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allCartsItem = await CartItem.find({ cart_id: cartId })
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Cart Items fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalCartItems: totalCartItems,
      data: allCartsItem,
    });

    // const allCartItems = await CartItem.find({ cart_id: cartId });
    // res.status(200).json({
    //   success: true,
    //   message: "List of Cart Items fetched successfully",
    //   data: allCartItems,
    // });
  } catch (e) {
    next(e);
  }
};

const getSingleCartItem = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const cartItem = await CartItem.findById(cartItemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message:
          "CartItem with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: cartItem,
    });
  } catch (e) {
    next(e);
  }
};

const addProductToCart = async (req, res, next) => {
  try {
    const { quantity, cart_id, product_id } = req.body;
    const cart = await Cart.findById(cart_id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart with the current ID is not found! Please try with a different ID",
      });
    }
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product with the current ID is not found! Please try with a different ID",
      });
    }

    const newCartItem = await CartItem.create({
      quantity,
      unit_price: product.price,
      cart_id,
      product_id,
    });
    res.status(201).json({
      success: true,
      message: "Product added to Cart successfully",
      data: newCartItem,
    });
  } catch (e) {
    next(e);
  }
};

const addCustomDesignToCart = async (req, res, next) => {
  try {
    const { quantity, cart_id, custom_design_id } = req.body;
    const cart = await Cart.findById(cart_id);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart with the current ID is not found! Please try with a different ID",
      });
    }
    const customDesign = await CustomDesign.findById(custom_design_id);
    if (!customDesign) {
      return res.status(404).json({
        success: false,
        message:
          "Custom Design with the current ID is not found! Please try with a different ID",
      });
    }
    const product = await Product.findById(customDesign.base_product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product base for the CustomDesign not found! Please try with a different ID",
      });
    }

    const newCartItem = await CartItem.create({
      quantity,
      unit_price: product.price,
      cart_id,
      custom_design_id,
    });
    res.status(201).json({
      success: true,
      message: "Product added to Cart successfully",
      data: newCartItem,
    });
  } catch (e) {
    next(e);
  }
};

const updateCartItemQuantityInCart = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    const updatedCartItem = await CartItem.findByIdAndUpdate(
      cartItemId,
      { quantity },
      {
        new: true,
      }
    );
    if (!updatedCartItem) {
      res.status(404).json({
        success: false,
        message: "CartItem is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "CartItem updated successfully",
      data: updatedCartItem,
    });
  } catch (e) {
    next(e);
  }
};

const deleteCartItemFromCart = async (req, res, next) => {
  try {
    const cartItemId = req.params.id;
    const deletedCartItem = await CartItem.findByIdAndDelete(cartItemId);

    if (!deletedCartItem) {
      res.status(404).json({
        success: false,
        message: "CartItem is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedCartItem,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllCart,
  getSingleCart,
  addNewCart,
  updateCart,
  deleteCart,
  getAllCartItemByCartId,
  getSingleCartItem,
  addProductToCart,
  addCustomDesignToCart,
  updateCartItemQuantityInCart,
  deleteCartItemFromCart,
};
