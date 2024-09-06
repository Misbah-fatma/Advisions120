// routes/liveClassRoutes.js
const express = require('express');
const router = express.Router();
const { createLiveClass, getLiveClasses } = require('../controllers/LiveClassController');

// POST route for creating a live class
router.post('/live-classes', createLiveClass);

// GET route for fetching live classes
router.get('/live-classes/student', getLiveClasses);

module.exports = router;
