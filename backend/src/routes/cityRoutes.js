const express = require('express');
const { getCities } = require('../controllers/cityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCities);

module.exports = router;
