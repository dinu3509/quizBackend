const router = require("express").Router();
const {
  uploadProfileImage,
  getProfileImage,
  getProfileInfo,
  saveProfileInfo,
} = require("../Controllers/ProfileController");

const upload = require("../Middlewares/Profile"); // multer memoryStorage middleware
const ensureAuthenticated = require("../Middlewares/Auth");

// -------- IMAGE ROUTES -------- //

router.get("/image", ensureAuthenticated, getProfileImage);

// -------- PROFILE INFO ROUTES -------- //
router.get("/info", ensureAuthenticated, getProfileInfo);
router.post("/info", ensureAuthenticated, upload.single("file"), saveProfileInfo);

module.exports = router;
