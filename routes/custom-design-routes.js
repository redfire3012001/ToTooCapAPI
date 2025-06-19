const express = require("express");
const {
  getAllCustomDesign,
  getSingleCustomDesign,
  addNewCustomDesign,
  updateCustomDesign,
  deleteCustomDesign,
} = require("../controllers/custom-design-controller");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.get("/get", getAllCustomDesign);
router.get("/get/:id", getSingleCustomDesign);
router.post("/add", addNewCustomDesign);
router.put("/update/:id", updateCustomDesign);
router.delete("/delete/:id", deleteCustomDesign);

module.exports = router;
