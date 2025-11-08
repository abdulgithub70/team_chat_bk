const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  durations: { type: [String], default: [] }, // ✅ array of durations
});

module.exports = mongoose.model("Attendance", attendanceSchema);
