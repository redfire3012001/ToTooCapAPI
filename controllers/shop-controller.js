const User = require("../models/User");
const Shop = require("../models/Shop");
require("dotenv").config();

const getAllShops = async (req, res, next) => {
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
        $or: [{ name: { $regex: searchTerm, $options: "i" } }],
      };
    }
    const totalShops = await Shop.countDocuments(query);
    const totalPages = Math.ceil(totalShops / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allShops = await Shop.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Shops fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalShops: totalShops,
      data: allShops,
    });
    // const allShops = await Shop.find({});
    // res.status(200).json({
    //   success: true,
    //   message: "List of Shops fetched successfully",
    //   data: allShops,
    // });
  } catch (e) {
    next(e);
  }
};

const getSingleShop = async (req, res, next) => {
  try {
    const shopId = req.params.id;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message:
          "Shop with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (e) {
    next(e);
  }
};

const addNewShop = async (req, res, next) => {
  try {
    const { name, platform, user_id } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User with the current ID is not found! Please try with a different ID",
      });
    }
    user.role = "shop";
    await user.save();

    const newShop = await Shop.create({ name, platform, user_id });
    if (newShop) {
      res.status(201).json({
        success: true,
        message: "Shop added successfully",
        data: newShop,
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateShop = async (req, res, next) => {
  try {
    const shopId = req.params.id;
    const { name, platform, user_id } = req.body;
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

    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { name, platform, user_id },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedShop) {
      res.status(404).json({
        success: false,
        message: "Shop is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Shop updated successfully",
      data: updatedShop,
    });
  } catch (e) {
    next(e);
  }
};

const deleteShop = async (req, res, next) => {
  try {
    const shopId = req.params.id;
    const deletedShop = await Shop.findByIdAndDelete(shopId);

    if (!deletedShop) {
      return res.status(404).json({
        success: false,
        message: "Shop is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedShop,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAllShops,
  getSingleShop,
  addNewShop,
  updateShop,
  deleteShop,
};
