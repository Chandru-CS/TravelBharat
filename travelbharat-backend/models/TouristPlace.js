const mongoose = require("mongoose");

const TouristPlaceSchema = new mongoose.Schema({
  name: String,
  state: { type: mongoose.Schema.Types.ObjectId, ref: "State" },
  city: String,
  category: String,
  description: String,
  bestTime: String,
  entryFee: String,
  timings: String,
  location: String,
  images: [String],
  nearbyAttractions: [String],
});

module.exports = mongoose.model("TouristPlace", TouristPlaceSchema);