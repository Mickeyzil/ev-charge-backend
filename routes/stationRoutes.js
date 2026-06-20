const express = require('express');
const router = express.Router();
const { getAllStations } = require('../controllers/stationController');

// נתיב לקבלת כל התחנות
router.get('/', getAllStations);

module.exports = router;