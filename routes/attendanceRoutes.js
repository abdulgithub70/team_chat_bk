const express = require("express");
const Attendance = require("../models/Attendance.js");

const router = express.Router();

// ✅ POST route to save attendance (check-in & check-out)
router.post("/", async (req, res) => {
  try {
    const { userId, name, date, duration, checkInTime, checkOutTime } = req.body;
    //console.log("📥 Attendance data received:", req.body);

    if (!userId || !name || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check if same user already has a record for this date
    let record = await Attendance.findOne({ userId, date });

    if (record) {
      // ✅ append new duration in array (if exists)
      if (duration) {
        record.durations.push(duration);
      }

      // Set check-in only if not already set
      if (!record.checkInTime && checkInTime) {
        record.checkInTime = checkInTime;
    }
      // update times if needed
      //record.checkInTime = record.checkInTime || checkInTime;
      record.checkOutTime = checkOutTime || record.checkOutTime;

      await record.save();
      return res.json({ message: "Duration added to existing record", record });
    }

    // ✅ create new attendance record
    const newRecord = await Attendance.create({
      userId,
      name,
      date,
      checkInTime,
      checkOutTime,
      durations: duration ? [duration] : [],
    });

    res.json({ message: "Attendance saved successfully", record: newRecord });
  } catch (err) {
    //console.error("❌ Error saving attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all attendance records (for admin)
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
