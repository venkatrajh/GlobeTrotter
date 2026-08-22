const express = require('express');
const { getAllActivities, getActivityById } = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllActivities);
router.get('/:id', getActivityById);

module.exports = router;
