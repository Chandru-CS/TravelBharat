const express = require("express");
const router = express.Router();
const State = require("../models/State");
const TouristPlace = require("../models/TouristPlace");
const authMiddleware = require("../middleware/auth");

// Get all states
router.get("/states", async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 });
    res.json(states);
  } catch (error) {
    res.status(500).json({ message: "Error fetching states", error: error.message });
  }
});

// Add new state (Admin only)
router.post("/states", authMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    const existingState = await State.findOne({ name });
    if (existingState) {
      return res.status(400).json({ message: "State already exists" });
    }

    const state = new State({
      name,
      description,
      image: image || `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, '')}/400/300.jpg`
    });

    await state.save();
    res.status(201).json({ message: "State added successfully", state });
  } catch (error) {
    res.status(500).json({ message: "Error adding state", error: error.message });
  }
});

// Update state (Admin only)
router.put("/states/:id", authMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const state = await State.findByIdAndUpdate(
      req.params.id,
      { name, description, image },
      { new: true, runValidators: true }
    );
    
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    res.json({ message: "State updated successfully", state });
  } catch (error) {
    res.status(500).json({ message: "Error updating state", error: error.message });
  }
});

// Delete state (Admin only)
router.delete("/states/:id", authMiddleware, async (req, res) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }

    // Delete all tourist places in this state
    await TouristPlace.deleteMany({ state: req.params.id });

    res.json({ message: "State and its places deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting state", error: error.message });
  }
});

// Get all tourist places
router.get("/places", async (req, res) => {
  try {
    const places = await TouristPlace.find().populate("state", "name");
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching places", error: error.message });
  }
});

// Get places by state
router.get("/states/:stateId/places", async (req, res) => {
  try {
    const places = await TouristPlace.find({ state: req.params.stateId })
      .populate("state", "name");
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching places", error: error.message });
  }
});

// Add new tourist place (Admin only)
router.post("/places", authMiddleware, async (req, res) => {
  try {
    const { name, state, city, category, description, bestTime, entryFee, timings, location, images, nearbyAttractions } = req.body;
    
    if (!name || !state || !city || !category) {
      return res.status(400).json({ message: "Name, state, city, and category are required" });
    }

    // Validate state exists
    const stateExists = await State.findById(state);
    if (!stateExists) {
      return res.status(400).json({ message: "Invalid state" });
    }

    const place = new TouristPlace({
      name,
      state,
      city,
      category,
      description,
      bestTime,
      entryFee,
      timings,
      location,
      images: images || [`https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, '')}1/800/600.jpg`],
      nearbyAttractions: nearbyAttractions || []
    });

    await place.save();
    await place.populate("state", "name");
    
    res.status(201).json({ message: "Place added successfully", place });
  } catch (error) {
    res.status(500).json({ message: "Error adding place", error: error.message });
  }
});

// Update tourist place (Admin only)
router.put("/places/:id", authMiddleware, async (req, res) => {
  try {
    const place = await TouristPlace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("state", "name");
    
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place updated successfully", place });
  } catch (error) {
    res.status(500).json({ message: "Error updating place", error: error.message });
  }
});

// Delete tourist place (Admin only)
router.delete("/places/:id", authMiddleware, async (req, res) => {
  try {
    const place = await TouristPlace.findByIdAndDelete(req.params.id);
    
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting place", error: error.message });
  }
});

module.exports = router;
