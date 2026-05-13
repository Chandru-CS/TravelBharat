const router = require("express").Router();
const { getStates, addState } = require("../controllers/stateController");

router.get("/", getStates);
router.post("/", addState);

module.exports = router;