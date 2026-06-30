const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/auth");
const { getMe, changePassword } = require("../controllers/meController");

const router = express.Router();

router.get("/", authenticate, asyncHandler(getMe));
router.patch("/password", authenticate, asyncHandler(changePassword));

module.exports = router;
