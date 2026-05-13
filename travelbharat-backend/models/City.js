const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  name: String,
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
  },
});

module.exports = mongoose.model("City", CitySchema);