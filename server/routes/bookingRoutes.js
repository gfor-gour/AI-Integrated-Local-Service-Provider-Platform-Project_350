// routes/bookingRoutes.js
const express = require("express");
const { createBooking, handleBookingResponse, getBookingStatus,getUserBookings } = require("../controllers/bookingController");
const router = express.Router();

// Create a Booking Request
router.post("/book", createBooking);

// Handle Accept/Reject from Provider
router.get("/respond", handleBookingResponse);

// Get Booking Status for User
router.get("/status/:bookingId", getBookingStatus);


router.get("/user/:userId", getUserBookings);

module.exports = router;
