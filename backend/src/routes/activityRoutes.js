const express = require('express');
const {
  updateStopActivity,
  deleteStopActivity,
} = require('../controllers/activityController');
const { validateRequest } = require('../validators/authValidators');
const { updateStopActivitySchema } = require('../validators/tripValidators');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.put('/:id', validateRequest(updateStopActivitySchema), updateStopActivity);
router.delete('/:id', deleteStopActivity);

module.exports = router;
