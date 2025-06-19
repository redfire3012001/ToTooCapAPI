const express = require("express");
const {
  getAllProduct,
  getSingleProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
  getAllProductVariant,
  getSingleProductVariant,
  addNewProductVariant,
  updateProductVariant,
  deleteProductVariant,
} = require("../controllers/product-controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.get("/get", getAllProduct);
router.get("/get/:id", getSingleProduct);
router.post("/add", addNewProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/Variant/get", getAllProductVariant);
router.get("/Variant/get/:id", getSingleProductVariant);
router.post("/Variant/add", addNewProductVariant);
router.put("/Variant/update/:id", updateProductVariant);
router.delete("/Variant/delete/:id", deleteProductVariant);

module.exports = router;
