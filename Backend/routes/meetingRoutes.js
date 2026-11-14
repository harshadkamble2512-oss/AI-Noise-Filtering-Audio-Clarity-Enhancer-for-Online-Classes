
const express = require("express");

const router = express.Router();

const {
  createMeeting,
  joinMeeting,
  getMeeting,
  getMyMeetings,
  endMeeting,
} = require("../controllers/meetingController");

const {
  protect,
  teacherOnly,
} = require("../middleware/authMiddleware");

// All meeting routes require login
router.use(protect);

// Only teachers can create meetings
router.post("/", teacherOnly, createMeeting);

// Get meetings created by logged-in user
router.get("/my", getMyMeetings);

// Students and teachers can join meetings
router.post("/join/:meetingCode", joinMeeting);

// Get meeting details
router.get("/:meetingCode", getMeeting);

// Only teachers can end meetings
router.patch("/:meetingCode/end", teacherOnly, endMeeting);

module.exports = router;
