const mongoose = require('mongoose');

// Define the Mongoose schema for Works
const WorkSchema = new mongoose.Schema(
  {
    work_id: String,
    work_title: String,
    work_description: String,
    assigned_to: String, // Employee ID or name
    assigned_by: String, // HR ID or name
    start_time: String,
    end_time: String,
    due_date: Date,
    status: { type: String, default: 'pending' }
  },
  { collection: 'DIALOGUEFLOW.WORKS' }
);

module.exports = mongoose.model('Work', WorkSchema, 'DIALOGUEFLOW.WORKS');
