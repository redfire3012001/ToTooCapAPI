const express = require('express');
const{registerUser, loginUser, checkauthentication} = require('../controllers/auth-controller')
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const hasRole = require("../middleware/hasRole");

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/checkauth', authMiddleware, hasRole(["admin", "shop"]), checkauthentication);



module.exports = router