const express = require("express");
const router = express.Router();
const {
    createReservation,
    getUserReservations
} = require("../controllers/reservationController");



router.get("/user/:userId", getUserReservations);
router.post("/create", createReservation);


module.exports = router;