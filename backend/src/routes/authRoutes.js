const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateRequest, signupSchema, loginSchema } = require('../validators/authValidators');

const router = express.Router();

router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);

module.exports = router;
