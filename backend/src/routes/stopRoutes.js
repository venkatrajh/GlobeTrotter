const express = require('express');
const {
  updateTripStop,
  deleteTripStop,
} = require('../controllers/stopController');
const {
  createStopActivity,
  getStopActivities,
} = require('../controllers/activityController');
const { validateRequest } = require('../validators/authValidators');
const { updateTripStopSchema, createStopActivitySchema } = require('../validators/tripValidators');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Stop routes
router.put('/:stopId', validateRequest(updateTripStopSchema), updateTripStop);
router.delete('/:stopId', deleteTripStop);

// Activity routes embedded under Stop
router.post('/:stopId/activities', validateRequest(createStopActivitySchema), createStopActivity);
router.get('/:stopId/activities', getStopActivities);

module.exports = router;
