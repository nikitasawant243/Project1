const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);  
})

async function main (){
    await mongoose.connect(MONGO_URL);
}

app.get('/', (req, res) => {
  res.send('Hello World!!'); 
});

app.get('/testListings', async (req, res) => {
    let sampleListing = new Listing({
        title : "My New Villa",
        description: "By the beach",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: 1500,
        location: "Bali",
        country: "Switzerland",
    });

    await sampleListing.save();
    console.log('Listing saved:');
    res.send('Listing saved successfully!');

});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
})