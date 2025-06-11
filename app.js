// Imports and Setup
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);  
})

async function main (){
    await mongoose.connect(MONGO_URL);
}

// View Engine Setup (EJS)
// Looks for .ejs files in the /views folder inside your project.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
// Home Route 

// Listings Route (Fetch and Render from MongoDB)
app.get('/listings', async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", {allListings});
});

// New Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new");
});

// Show Route
app.get("/listings/:id", async(req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id); 
  res.render("listings/show", {listing});
});

// Create Route

app.post("/listings", async (req,res) => {
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");

})

// edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id); 
  res.render("listings/edit.ejs", {listing});
})


// Update Route 
app.put("/listings/:id", async (req, res) => {
  let {id} = req.params;
  const updatedData = req.body.listing;

// Optional safety: if image.url is present, assign as nested object
if (updatedData.image && typeof updatedData.image === 'object' && updatedData.image.url) {
  updatedData.image = { url: updatedData.image.url };
}

await Listing.findByIdAndUpdate(id, updatedData);

  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// app.get('/testListings', async (req, res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description: "By the beach",
//         image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price: 1500,
//         location: "Bali",
//         country: "Switzerland",
//     });

//     await sampleListing.save();
//     console.log('Listing saved:');
//     res.send('Listing saved successfully!');

// });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
})