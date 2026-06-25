const express = require('express');
const router = express.Router();
const { getAllStations, updateStationByExternalCompany } = require('../controllers/stationController');

router.get('/', getAllStations);
router.put('/external-update/:station_id', updateStationByExternalCompany);
module.exports = router;