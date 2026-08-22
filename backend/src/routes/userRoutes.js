const express = require('express');
const { getMe, updateMe, deleteMe } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getMe);
router.put('/me', updateMe);
router.delete('/me', deleteMe);

module.exports = router;
