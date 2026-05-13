const TouristPlace = require("../models/TouristPlace");

exports.getPlaces = async (req, res) => {
  const places = await TouristPlace.find().populate("state");
  res.json(places);
};

exports.getPlacesByState = async (req, res) => {
  const places = await TouristPlace.find({ state: req.params.id });
  res.json(places);
};

exports.getPlaceById = async (req, res) => {
  const place = await TouristPlace.findById(req.params.id).populate("state");

  if (!place) {
    return res.status(404).json({ message: "Place not found" });
  }

  res.json(place);
};

exports.addPlace = async (req, res) => {
  const place = await TouristPlace.create(req.body);
  res.json(place);
};