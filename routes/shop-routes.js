const express = require('express');
const{getAllShops, getSingleShop, addNewShop, updateShop, deleteShop} = require('../controllers/shop-controller')
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.get("/get", getAllShops);
router.get("/get/:id", getSingleShop);
router.post("/add", addNewShop);
router.put("/update/:id", updateShop);
router.delete("/delete/:id", deleteShop);

module.exports = router