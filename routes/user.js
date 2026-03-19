const express = require("express");
const router = express.Router();
const userAuth = require('../controllers/auth');

router.post('/signup',userAuth.signUp)
router.post('/login',userAuth.login)


module.exports = router;