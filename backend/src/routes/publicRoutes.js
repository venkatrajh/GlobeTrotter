const express = require('express');
const { getPublicTrip, copyPublicTrip } = require('../controllers/publicController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/trips/:slug', getPublicTrip);
router.post('/trips/:slug/copy', authMiddleware, copyPublicTrip);

module.exports = router;
