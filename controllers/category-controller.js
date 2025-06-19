const Category = require("../models/Category");
require("dotenv").config();

const getAllCategory = async (req, res, next) => {
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
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }
    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allCategories = await Category.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Categories fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalCategories: totalCategories,
      data: allCategories,
    });
    // const allCategories = await Category.find({});
    // res.status(200).json({
    //   success: true,
    //   message: "List of Categories fetched successfully",
    //   data: allCategories,
    // });
  } catch (e) {
    next(e);
  }
};

const getSingleCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (e) {
    next(e);
  }
};

const addNewCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newCategory = await Category.create({ name, description });
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      {
        new: true,
      }
    );
    if (!updatedCategory) {
      res.status(404).json({
        success: false,
        message: "Category is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedCategory,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllCategory,
  getSingleCategory,
  addNewCategory,
  updateCategory,
  deleteCategory,
};
