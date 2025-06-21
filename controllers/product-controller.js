const Category = require("../models/Category");
const Shop = require("../models/Shop");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
require("dotenv").config();

const getAllProduct = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const searchTerm = req.query.searchTerm;
    const categoryName = req.query.categoryName;

    let query = {};
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
      // query = {
      //   $or: [
      //     { name: { $regex: searchTerm, $options: "i" } },
      //     { description: { $regex: searchTerm, $options: "i" } },
      //   ],
      // };
    }
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      query.category_id = category._id;
    }

    const skip = (currentPage - 1) * limit;
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allProducts = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Products fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalProducts: totalProducts,
      data: allProducts,
    });
    // const allProducts = await Product.find({});
    // res.status(200).json({
    //   success: true,
    //   message: "List of Products fetched successfully",
    //   data: allProducts,
    // });
  } catch (e) {
    next(e);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    next(e);
  }
};

const addNewProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock_quantity, image_url, category_id } =
      req.body;
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message:
          "Category with the current ID is not found! Please try with a different ID",
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock_quantity,
      image_url,
      category_id,
    });
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (e) {
    next(e);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, description, price, stock_quantity, image_url, category_id } =
      req.body;
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message:
            "Category with the current ID is not found! Please try with a different ID",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, stock_quantity, image_url, category_id },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: "Product is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (e) {
    next(e);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedProduct,
    });
  } catch (e) {
    next(e);
  }
};

const getAllProductVariant = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const searchTerm = req.query.searchTerm;
    const shopName = req.query.shopName;
    const productName = req.query.productName;

    let query = {};
    if (searchTerm) {
      query.$or = [{ name: { $regex: searchTerm, $options: "i" } }];
      // query = {
      //   $or: [{ name: { $regex: searchTerm, $options: "i" } }],
      // };
    }
    if (shopName) {
      const shop = await Shop.findOne({ name: shopName });
      query.shop_id = shop._id;
    }
    if (productName) {
      const product = await Product.findOne({ name: productName });
      query.product_id = product._id;
    }

    const skip = (currentPage - 1) * limit;
    const totalProductVariants = await ProductVariant.countDocuments(query);
    const totalPages = Math.ceil(totalProductVariants / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allProductsVariants = await ProductVariant.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Product Variants fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalProductVariants: totalProductVariants,
      data: allProductsVariants,
    });
    // const allProductsVariants = await ProductVariant.find({});
    // res.status(200).json({
    //   success: true,
    //   message: "List of Products Variants fetched successfully",
    //   data: allProductsVariants,
    // });
  } catch (e) {
    next(e);
  }
};

const getSingleProductVariant = async (req, res, next) => {
  try {
    const productVariantId = req.params.id;
    const productVariant = await ProductVariant.findById(productVariantId);

    if (!productVariant) {
      return res.status(404).json({
        success: false,
        message:
          "Product Variant with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: productVariant,
    });
  } catch (e) {
    next(e);
  }
};

const addNewProductVariant = async (req, res, next) => {
  try {
    const { name, platform, shop_id, product_id } = req.body;
    const shop = await Shop.findById(shop_id);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message:
          "Shop with the current ID is not found! Please try with a different ID",
      });
    }
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product with the current ID is not found! Please try with a different ID",
      });
    }

    const newProductVariant = await ProductVariant.create({
      name,
      platform,
      shop_id,
      product_id,
    });
    res.status(201).json({
      success: true,
      message: "Product Variant added successfully",
      data: newProductVariant,
    });
  } catch (e) {
    next(e);
  }
};

const updateProductVariant = async (req, res, next) => {
  try {
    const productVariantId = req.params.id;
    const { name, platform, shop_id, product_id } = req.body;
    if (shop_id) {
      const shop = await Shop.findById(shop_id);
      if (!shop) {
        return res.status(404).json({
          success: false,
          message:
            "Shop with the current ID is not found! Please try with a different ID",
        });
      }
    }
    if (product_id) {
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product with the current ID is not found! Please try with a different ID",
        });
      }
    }

    const updatedProductVariant = await ProductVariant.findByIdAndUpdate(
      productVariantId,
      { name, platform, shop_id, product_id },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProductVariant) {
      res.status(404).json({
        success: false,
        message: "Product Variant is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Variant updated successfully",
      data: updatedProductVariant,
    });
  } catch (e) {
    next(e);
  }
};

const deleteProductVariant = async (req, res, next) => {
  try {
    const productVariantId = req.params.id;
    const deletedProductVariant = await ProductVariant.findByIdAndDelete(
      productVariantId
    );

    if (!deletedProductVariant) {
      return res.status(404).json({
        success: false,
        message: "Product Variant is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedProductVariant,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
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
};
