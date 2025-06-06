const express = require('express');
const{registerUser, loginUser, googleAuthRedirect, googleAuthCallback, getAllUsers, getLoginUser, updateUser, checkauthentication} = require('../controllers/auth-controller')
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);
router.get('/users', authMiddleware, getAllUsers);
router.get('/loginUser', authMiddleware, getLoginUser);
router.get('/checkauth', authMiddleware, hasRole(["admin", "shop"]), checkauthentication);
router.put('/updateUser', authMiddleware, updateUser);

module.exports = router