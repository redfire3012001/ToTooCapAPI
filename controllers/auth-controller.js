const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, address, role } = req.body;

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};

const loginUser = async (req, res) => {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};

const googleAuthRedirect = (req, res) => {
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

const googleAuthCallback = async (req, res) => {
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
        Math.floor(Math.random() * 1000).toString(),
        salt
      );
      user = new User({
        username: name + Math.floor(Math.random() * 1000),
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers?.length > 0) {
      res.status(200).json({
        success: true,
        message: "List of Users fetched successfully",
        data: allUsers,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No Users found in collection",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
  }
};

const getLoginUser = async (req, res) => {
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
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const newUser = req.body;
    const userId = req.userInfo.userId;
    const updatedUser = await User.findByIdAndUpdate(userId, newUser, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};
const checkauthentication = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "check auth",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured! Please try again",
    });
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
};
