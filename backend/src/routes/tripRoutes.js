const express = require('express');
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getFullItinerary,
  getTripTimeline,
} = require('../controllers/tripController');
const {
  createTripStop,
  getTripStops,
} = require('../controllers/stopController');
const { validateRequest } = require('../validators/authValidators');
const { createTripSchema, updateTripSchema, createTripStopSchema } = require('../validators/tripValidators');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Trip routes
router.post('/', validateRequest(createTripSchema), createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id', validateRequest(updateTripSchema), updateTrip);
router.delete('/:id', deleteTrip);
router.get('/:id/full', getFullItinerary);
router.get('/:id/timeline', getTripTimeline);

// Stop routes embedded under Trip
router.post('/:tripId/stops', validateRequest(createTripStopSchema), createTripStop);
router.get('/:tripId/stops', getTripStops);

// Budget routes embedded under Trip
const { getTripBudget, createBudgetItem, getBudgetItems } = require('../controllers/budgetController');
const { createBudgetItemSchema } = require('../validators/budgetValidators');

router.get('/:id/budget', getTripBudget);
router.post('/:id/budget/items', validateRequest(createBudgetItemSchema), createBudgetItem);
router.get('/:id/budget/items', getBudgetItems);

// Sharing routes embedded under Trip
const { getShareStatus, createShare, disableShare } = require('../controllers/shareController');

router.get('/:id/share', getShareStatus);
router.post('/:id/share', createShare);
router.delete('/:id/share', disableShare);

module.exports = router;
