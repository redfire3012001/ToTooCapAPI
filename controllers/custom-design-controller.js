const CustomDesign = require("../models/CustomDesign");
const Product = require("../models/Product");
const User = require("../models/User");
require("dotenv").config();

const getAllCustomDesign = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const searchTerm = req.query.searchTerm;
    const userName = req.query.userName;
    const productName = req.query.productName;

    let query = {};
    if (searchTerm) {
      query.$or = [
        { design_name: { $regex: searchTerm, $options: "i" } },
        { text: { $regex: searchTerm, $options: "i" } },
        { color: { $regex: searchTerm, $options: "i" } },
      ];
      // query = {
      //   $or: [
      //     { design_name: { $regex: searchTerm, $options: "i" } },
      //     { text: { $regex: searchTerm, $options: "i" } },
      //     { color: { $regex: searchTerm, $options: "i" } },
      //   ],
      // };
    }
    if (productName) {
      const product = await Product.findOne({ name: productName });
      query.base_product_id = product._id;
    }
    if (userName) {
      const user = await User.findOne({ username: userName });
      query.user_id = user._id;
    }

    const skip = (currentPage - 1) * limit;
    const totalCustomDesigns = await CustomDesign.countDocuments(query);
    const totalPages = Math.ceil(totalCustomDesigns / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allCustomDesigns = await CustomDesign.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Custom Designs fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalCustomDesigns: totalCustomDesigns,
      data: allCustomDesigns,
    });
    // const allCustomDesigns = await CustomDesign.find({});
    // res.status(200).json({
    //   success: true,
    //   message: "List of CustomDesign fetched successfully",
    //   data: allCustomDesigns,
    // });
  } catch (e) {
    next(e);
  }
};

const getSingleCustomDesign = async (req, res, next) => {
  try {
    const customDesignId = req.params.id;
    const customDesign = await CustomDesign.findById(customDesignId);

    if (!customDesign) {
      return res.status(404).json({
        success: false,
        message:
          "CustomDesign with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: customDesign,
    });
  } catch (e) {
    next(e);
  }
};

const addNewCustomDesign = async (req, res, next) => {
  try {
    const {
      design_name,
      color,
      text,
      image_url,
      status,
      user_id,
      base_product_id,
    } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User with the current ID is not found! Please try with a different ID",
      });
    }
    const product = await Product.findById(base_product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product with the current ID is not found! Please try with a different ID",
      });
    }

    const newCustomDesign = await CustomDesign.create({
      design_name,
      color,
      text,
      image_url,
      status,
      user_id,
      base_product_id,
    });
    res.status(201).json({
      success: true,
      message: "CustomDesign added successfully",
      data: newCustomDesign,
    });
  } catch (e) {
    next(e);
  }
};

const updateCustomDesign = async (req, res, next) => {
  try {
    const customDesignId = req.params.id;
    const {
      design_name,
      color,
      text,
      image_url,
      status,
      user_id,
      base_product_id,
    } = req.body;
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
    if (base_product_id) {
      const product = await Product.findById(base_product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product with the current ID is not found! Please try with a different ID",
        });
      }
    }

    const updatedCustomDesign = await CustomDesign.findByIdAndUpdate(
      customDesignId,
      { design_name, color, text, image_url, status, user_id, base_product_id },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCustomDesign) {
      return res.status(404).json({
        success: false,
        message: "CustomDesign is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "CustomDesign updated successfully",
      data: updatedCustomDesign,
    });
  } catch (e) {
    next(e);
  }
};

const deleteCustomDesign = async (req, res, next) => {
  try {
    const customDesignId = req.params.id;
    const deletedCustomDesign = await CustomDesign.findByIdAndDelete(
      customDesignId
    );

    if (!deletedCustomDesign) {
      return res.status(404).json({
        success: false,
        message: "CustomDesign is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedCustomDesign,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllCustomDesign,
  getSingleCustomDesign,
  addNewCustomDesign,
  updateCustomDesign,
  deleteCustomDesign,
};
