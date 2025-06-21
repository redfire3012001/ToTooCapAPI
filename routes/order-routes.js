const express = require("express");
const {
  getAllOrder,
  getSingleOrder,
  addNewOrder,
  updateOrder,
  deleteOrder,
  getAllOrderItems,
  getSingleOrderItem,
} = require("../controllers/order-controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.get("/get", getAllOrder);
router.get("/get/:id", getSingleOrder);
router.post("/add", addNewOrder);
router.put("/update/:id", updateOrder);
router.delete("/delete/:id", deleteOrder);
router.get("/orderItem/get", getAllOrderItems);
router.get("/orderItem/get/:id", getSingleOrderItem);

module.exports = router;
