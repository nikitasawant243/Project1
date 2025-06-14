const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require('../models/listing.js');
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
}

// Listings Route (Fetch and Render from MongoDB)
router.get('/', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// New Route
router.get("/new", isLoggedIn, (req, res) =>{
  res.render("listings/new");
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  
  res.render("listings/show", { listing });
})); 


// Create Route

router.post("/",isLoggedIn, wrapAsync(async (req, res, next) => {

  const newListing = new Listing(req.body.listing); 
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing reated!");
  res.redirect("/listings");
})


);

// edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));


// Update Route 
router.put("/:id",isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const updatedData = req.body.listing;

  // Optional safety: if image.url is present, assign as nested object
  if (updatedData.image && typeof updatedData.image === 'object' && updatedData.image.url) {
    updatedData.image = { url: updatedData.image.url };
  }

  await Listing.findByIdAndUpdate(id, updatedData);
  req.flash("success", "Listing Updated!");

  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id",isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});


module.exports = router;