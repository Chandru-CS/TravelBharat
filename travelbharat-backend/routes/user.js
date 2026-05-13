const router = require("express").Router();
const { register, login, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;
