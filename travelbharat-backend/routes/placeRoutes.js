const router = require("express").Router();
const {
  getPlaces,
  addPlace,
  getPlacesByState,
  getPlaceById,
} = require("../controllers/placeController");

router.get("/", getPlaces);
router.get("/state/:id", getPlacesByState);
router.get("/:id", getPlaceById);
router.post("/", addPlace);

module.exports = router;