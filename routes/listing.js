const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController   = require("../controllers/listing.js")

//Index Route
router.get('/', wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm );

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/", isLoggedIn, wrapAsync(listingController.createListing));

// edit Route
router.get("/:id/edit", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.renderEditForm));

// Update Route 
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, listingController.destroyListing);


module.exports = router;