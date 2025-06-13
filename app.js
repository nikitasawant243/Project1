// Imports and Setup
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const moment = require("moment");
app.locals.moment = moment;

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
})

async function main() {
  await mongoose.connect(MONGO_URL);
}

// View Engine Setup (EJS)
// Looks for .ejs files in the /views folder inside your project.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Home Route 
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("/{*any}", (req, res, next) => {
  next(new ExpressError(404, `Page Not found: ${req.originalUrl}`));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})