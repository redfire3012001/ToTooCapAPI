const express = require("express");
const {
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
} = require("../controllers/cart-controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.get("/get", getAllCart);
router.get("/get/:id", getSingleCart);
router.post("/add", addNewCart);
router.put("/update/:id", updateCart);
router.delete("/delete/:id", deleteCart);
router.get("/CartItem/getByCartId/:id", getAllCartItemByCartId);
router.get("/CartItem/get/:id", getSingleCartItem);
router.post("/CartItem/product/add", addProductToCart);
router.post("/CartItem/custom-design/add", addCustomDesignToCart);
router.put("/CartItem/update/:id", updateCartItemQuantityInCart);
router.delete("/CartItem/delete/:id", deleteCartItemFromCart);

module.exports = router;
