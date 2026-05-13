const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
});

module.exports = mongoose.model("State", StateSchema);