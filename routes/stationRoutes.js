const express = require('express');
const router = express.Router();
const { getAllStations, updateStationByExternalCompany, createStation, deleteStation } 
= require('../controllers/stationController');

router.get('/', getAllStations);
router.put('/external-update/:station_id', updateStationByExternalCompany);
router.post('/', createStation);           
router.delete('/:station_id', deleteStation);

module.exports = router;