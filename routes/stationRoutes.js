const express = require('express');
const router = express.Router();
const { getAllStations, updateStationByExternalCompany } = require('../controllers/stationController');

// נתיב לקבלת כל התחנות
router.get('/external-update/:station_id', getAllStations);
router.put('/external-update/:station_id', updateStationByExternalCompany);

module.exports = router;