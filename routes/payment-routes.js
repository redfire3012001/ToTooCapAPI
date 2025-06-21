const express = require("express");
const {
  addNewPayment,
  vnpayUrl,
  vnpayReturn,
  getAllPayment,
  getSinglePayment,
  updatePayment,
} = require("../controllers/payment-controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.get("/get", getAllPayment);
router.get("/get/:id", getSinglePayment);
router.post("/add", addNewPayment);
router.put("/update/:id", updatePayment);
router.get("/vnpay/url", vnpayUrl);
router.get("/vnpay/return", vnpayReturn);

module.exports = router;
