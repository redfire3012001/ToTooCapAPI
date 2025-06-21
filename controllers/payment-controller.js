const Payment = require("../models/Payment");
const Order = require("../models/Order");
const querystring = require("qs");
const crypto = require("crypto");
const moment = require("moment");
require("dotenv").config();

const addNewPayment = async (req, res, next) => {
  try {
    const { order_id } = req.body;
    const order = await Order.findById(order_id);
    if (!order || order.status === "Cancel") {
      return res.status(404).json({
        success: false,
        message:
          "Order with the current ID is not found or the order is cancel ! Please try with a different ID",
      });
    }

    const newPayment = await Payment.create({
      amount: order.total_amount,
      payment_status: "Processing",
      payment_method: order.payment_method,
      order_id: order._id,
    });

    res.status(201).json({
      success: true,
      message: "Payment added successfully",
      data: newPayment,
    });
  } catch (e) {
    next(e);
  }
};

const vnpayUrl = async (req, res, next) => {
  try {
    const paymentId = req.query.paymentId;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(400).json({
        success: false,
        message: "payment not found",
      });
    }

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let returnUrl = process.env.vnpay_return_url;
    let orderId = moment(date).format("DDHHmmss");
    let amount = payment.amount;

    let locale = "vn";
    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = payment._id;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100000;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return res.status(201).json({
      success: true,
      data: vnpUrl,
    });
  } catch (e) {
    next(e);
  }
};

function sortObject(obj) {
  if (!obj || typeof obj !== "object") {
    return {};
  }
  let sorted = {};
  let str = [];
  for (let key of Object.keys(obj)) {
    str.push(encodeURIComponent(key));
  }
  str.sort();
  for (let i = 0; i < str.length; i++) {
    let decodedKey = decodeURIComponent(str[i]);
    sorted[str[i]] = encodeURIComponent(obj[decodedKey]).replace(/%20/g, "+");
  }
  return sorted;
}

const vnpayReturn = async (req, res, next) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);
    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash != signed && vnp_Params["vnp_ResponseCode"] != "00") {
      return res.status(500).json({
        success: false,
        message: "payment fail",
      });
      // res.redirect(
      //   `${process.env.frontendPaymentFailUrl}`
      // );
    }

    const paymentId = vnp_Params["vnp_OrderInfo"];
    var payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "payment not found in database",
      });
      // res.redirect(
      //   `${process.env.frontendPaymentFailUrl}`
      // );
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { payment_date: Date.now(), payment_status: "Done" },
      {
        new: true,
        runValidators: true,
      }
    );

    res.redirect(
      `${process.env.frontendPaymentSuccessUrl}&paymentId=${updatedPayment._id}`
    );
    res.status(200).json({
      success: true,
      message: "payment success",
      data: updatedPayment,
    });
  } catch (e) {
    next(e);
  }
};

const getAllPayment = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const paymentStatus = req.query.paymentStatus;
    const orderId = req.query.orderId;

    let query = {};
    if (paymentStatus) {
      query.payment_status = paymentStatus;
    }
    if (orderId) {
      query.order_id = orderId;
    }

    const skip = (currentPage - 1) * limit;
    const totalPayments = await Payment.countDocuments(query);
    const totalPages = Math.ceil(totalPayments / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const allPayments = await Payment.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "List of Payments fetched successfully",
      currentPage: currentPage,
      totalPages: totalPages,
      totalPayments: totalPayments,
      data: allPayments,
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

const getSinglePayment = async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment with the current ID is not found! Please try with a different ID",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (e) {
    next(e);
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const paymentId = req.params.id;
    const { payment_status, payment_method } = req.body;

    const updateFields = { payment_status, payment_method };
    if (payment_status === "Done") {
      updateFields.payment_date = new Date();
    }
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedPayment) {
      res.status(404).json({
        success: false,
        message: "Payment is not found with this ID",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: updatedPayment,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addNewPayment,
  vnpayUrl,
  vnpayReturn,
  getAllPayment,
  getSinglePayment,
  updatePayment,
};
