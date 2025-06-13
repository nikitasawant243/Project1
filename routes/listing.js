const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require('../models/listing.js'); 

const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  console.log(error);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,error);
  }else{
    next();
  }
}

// Listings Route (Fetch and Render from MongoDB)
router.get('/', wrapAsync (async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", {allListings});
}));

// New Route
router.get("/new", (req,res) => {
    res.render("listings/new");
});

// Show Route
router.get("/:id",wrapAsync (async(req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews"); 
  res.render("listings/show", {listing});
}));


// Create Route

router.post("/", wrapAsync (async (req,res, next) => {
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  })

 
);

// edit Route
router.get("/:id/edit", wrapAsync (async (req, res) => {
  // if(!req.body.listing){
  //   throw new ExpressError(400,"Send valid data for listing");
  // }
  let {id} = req.params;
  const listing = await Listing.findById(id); 
  res.render("listings/edit.ejs", {listing});
}));


// Update Route 
router.put("/:id", wrapAsync (async (req, res) => {
  let {id} = req.params;
  const updatedData = req.body.listing;

// Optional safety: if image.url is present, assign as nested object
if (updatedData.image && typeof updatedData.image === 'object' && updatedData.image.url) {
  updatedData.image = { url: updatedData.image.url };
}

await Listing.findByIdAndUpdate(id, updatedData);

  res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", async (req, res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});


module.exports = router;