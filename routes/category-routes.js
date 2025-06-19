const express = require('express');
const{getAllCategory, getSingleCategory, addNewCategory, updateCategory, deleteCategory} = require('../controllers/category-controller')
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.get("/get", getAllCategory);
router.get("/get/:id", getSingleCategory);
router.post("/add", addNewCategory);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router