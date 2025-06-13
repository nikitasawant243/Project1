const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    }
}, { timestamps: true }); // ✅ Automatically adds createdAt & updatedAt

module.exports = mongoose.model("Review", reviewSchema);
