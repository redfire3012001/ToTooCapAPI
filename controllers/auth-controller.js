const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, phone, address, role } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    const checkExistingUser = await User.findOne({ username });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newlyCreatedUser = new User({
      username,
      email,
      phone,
      address,
      password: hashedPassword,
      role: role || "customer",
    });

    await newlyCreatedUser.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User doesn't exists`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password!",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successful",
      accessToken,
    });
  } catch (e) {
    next(e);
  }
};

const googleAuthRedirect = (req, res, next) => {
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.CLIENT_ID}&` +
    `redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=profile email`;
  res.status(200).json({
    success: true,
    url,
  });
};

const googleAuthCallback = async (req, res, next) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({
      success: false,
      message: `Authentication code missing`,
    });
  }
  try {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });
    const { access_token, id_token } = data;
    const decodedToken = jwt.decode(id_token);
    if (!decodedToken) {
      return res.status(400).json({
        success: false,
        message: `Invalid Token`,
      });
    }

    const email = decodedToken.email;
    const name = decodedToken.name;
    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        crypto.randomBytes(16).toString("hex"),
        salt
      );
      user = new User({
        username: "Google: " + name,
        email,
        password: hashedPassword,
        role: "customer",
      });
      await user.save();
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successful",
      accessToken,
    });
  } catch (e) {
    next(e);
  }
};

const getAllUsers = async (req, res, next) => {
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
          { username: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allUsers = await User.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Users fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalUsers: totalUsers,
      data: allUsers,
    });
  } catch (e) {
    next(e);
  }
};

const getLoginUser = async (req, res, next) => {
  try {
    const userId = req.userInfo.userId;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "Please Login",
      });
    }
    const user = await User.findOne({ _id: userId });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (e) {
    next(e);
  }
};
const updateUser = async (req, res, next) => {
  try {
    const { username, email, password, phone, address, role } = req.body;
    const userId = req.params.id;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, password: hashedPassword, phone, address, role },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found with this id",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (e) {
    next(e);
  }
};
const checkauthentication = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "check auth",
    });
  } catch (e) {
    next(e);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      data: deletedUser,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuthRedirect,
  googleAuthCallback,
  checkauthentication,
  getAllUsers,
  getLoginUser,
  updateUser,
  deleteUser,
};
