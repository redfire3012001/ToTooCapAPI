const express = require('express');
const{registerUser, loginUser, googleAuthRedirect, googleAuthCallback, getAllUsers, getLoginUser, updateUser, checkauthentication, deleteUser} = require('../controllers/auth-controller')
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/google', googleAuthRedirect);
router.get('/google/callback', googleAuthCallback);
router.get('/user/get', authMiddleware, getAllUsers);
router.get('/user/get/loginUser', authMiddleware, getLoginUser);
router.put('/user/update/:id', authMiddleware, updateUser);
router.delete('/user/delete/:id', authMiddleware, deleteUser);
router.get('/checkauth', authMiddleware, hasRole(["admin", "shop"]), checkauthentication);

module.exports = router