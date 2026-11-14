const crypto = require("crypto");
const Meeting = require("../models/Meeting");

// Generate a unique meeting code
async function generateMeetingCode() {
  let code;
  let exists = true;

  while (exists) {
    code = crypto.randomBytes(4).toString("hex").toUpperCase();
    exists = await Meeting.exists({ meetingCode: code });
  }

  return code;
}

// Create a new meeting
exports.createMeeting = async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Meeting title is required",
      });
    }

    const meetingCode = await generateMeetingCode();

    if (!req.user || !req.user._id) {
  return res.status(401).json({
    success: false,
    message: "User authentication failed.",
  });
}

    const meeting = await Meeting.create({
      title,
      meetingCode,
      host: req.user._id,
      participants: [req.user._id],
    });

    return res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting,
    });
  } catch (error) {
    console.error("Create meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create meeting",
    });
  }
};

// Join an existing meeting
exports.joinMeeting = async (req, res) => {
  try {
    const meetingCode = req.params.meetingCode.trim().toUpperCase();

    const meeting = await Meeting.findOne({
      meetingCode,
      status: "active",
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found or has ended",
      });
    }

    const userId = req.user._id;

    const alreadyJoined = meeting.participants.some(
      (participantId) => participantId.toString() === userId.toString()
    );

    if (!alreadyJoined) {
      meeting.participants.push(userId);
      await meeting.save();
    }

    return res.status(200).json({
      success: true,
      message: "Joined meeting successfully",
      meeting,
    });
  } catch (error) {
    console.error("Join meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join meeting",
    });
  }
};

// Get meeting details
exports.getMeeting = async (req, res) => {
  try {
    const meetingCode = req.params.meetingCode.trim().toUpperCase();

    const meeting = await Meeting.findOne({
      meetingCode,
      status: "active",
    })
      .populate("host", "name email role")
      .populate("participants", "name email role");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    return res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("Get meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch meeting details",
    });
  }
};

// Get meetings created by the logged-in user
exports.getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      host: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("host", "name email role");

    return res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error("Get my meetings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your meetings",
    });
  }
};

// End a meeting created by the logged-in host
exports.endMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      meetingCode: req.params.meetingCode.trim().toUpperCase(),
      host: req.user._id,
      status: "active",
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Active meeting not found or you are not its host",
      });
    }

    meeting.status = "ended";
    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Meeting ended successfully",
      meeting,
    });
  } catch (error) {
    console.error("End meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to end meeting",
    });
  }
};
