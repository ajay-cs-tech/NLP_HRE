// controllers/workController.js
const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
var work1 = "";
var token1 = "";
var msg1 = "";

//db
const Emp = require('../models/userdetails')
const Work = require('../models/workdetails');

//services
const { generateAudioFromText } = require('../services/textToSpeechService');
const { sendNotification } = require('../services/fcmService');
const { sendMail } = require('../services/mail');

const router = express.Router();

router.post('/reg', async (req, res) => {
  const eid = req.body.assigned_to;
  const wt = req.body.work_title;
  const wd = req.body.work_description;
  try {
    const { work_id, work_title, work_description, assigned_to, assigned_by, start_time, end_time, due_date } = req.body;
    
    const startTime = new Date(start_time);

    const workDetails = new Work({
      work_id,
      work_title,
      work_description,
      assigned_to,
      assigned_by,
      start_time: startTime,
      end_time,
      due_date
    });
    const savedWork = await workDetails.save();
    res.status(201).json(savedWork);
    notify_for_work(eid,wt, wd, savedWork);
  } catch (error) {
    console.error('Error registering work:', error);
    res.status(500).json({ error: error.message });
  }
});

async function notify_for_work(assigned_to,work_title, msg, workDetails) {
  //const reminderTime = calculateReminderTime(startTime);
// Fetch token from database using assigned_to (emp_id)
const employee = await Emp.findOne({ emp_id: assigned_to });

if (!employee) {
  throw new Error('Employee not found');
}

    const token = employee.emp_token; // Assuming emp_token is the field in your model
    const name = employee.emp_name;
    const mail = employee.emp_emailid;
    const sub = `Work Update for ${name}`;
    const reminderMessage = `Hi ${name}, I just called you to inform about the work "${work_title}". ${msg}. Please be prepared.`;
   const  audioC = await generateAudioFromText(reminderMessage);
   await notify_through_mail(mail, sub, workDetails);
   work1 = work_title;
   msg1 = msg;
   token1 = token;
    await sendNotification(token, work_title, msg);
}

router.post('/na', async(req, res) => {
  const status = await sendNotification(token1, work1, msg1);
  console.log(status);
});

async function notify_through_mail(mail, sub, work_det){
  // Read the HTML template
const emailTemplate = fs.readFileSync(path.join(__dirname, 'emailtemp.html'), 'utf-8');

const { work_id, work_title, work_description, assigned_to, assigned_by, start_time, end_time, due_date } = work_det;

// Substitute placeholders with actual values
const emailContent = emailTemplate
  .replace('{{work_id}}', work_id)
  .replace('{{work_title}}', work_title)
  .replace('{{work_description}}', work_description)
  .replace('{{assigned_to}}', assigned_to)
  .replace('{{assigned_by}}', assigned_by)
  .replace('{{start_time}}', start_time)
  .replace('{{end_time}}', end_time)
  .replace('{{due_date}}', due_date);

  const mailOptions = {
    from : process.env.EMAIL_FROM_USER,
    to : mail,
    subject : sub,
    text : 'ntg',
    html : emailContent
  };

  await sendMail(mailOptions);
}


async function notify_for_announcements(work_title, work_msg, hr_name) {
  //const reminderTime = calculateReminderTime(startTime);
// Fetch token from database using assigned_to (emp_id)
const employee = await Emp.findOne({ emp_id: assigned_to });

if (!employee) {
  throw new Error('Employee not found');
}

    const token = employee.emp_token; // Assuming emp_token is the field in your model
    const reminderMessage = ` "${work_title}" is announced by "${hr_name}". Please be prepared for doing the work.${work_msg} `;
   const  base64String = await generateAudioFromText(reminderMessage);
    await sendNotification(token);
}

module.exports = router;


// const express = require('express');
// const router = express.Router();

// const { calculateReminderTime } = require('../utils/dateUtils');
// const Work = require('../models/workdetails');
// const { generateAudioFromText } = require('../services/textToSpeechService');
// const { sendNotification } = require('../services/fcmService');

// // Function to register a new work assignment
// router.post('/tok', async (req, res) => {
//   try {
//     const { work_id, work_title, work_description, assigned_to, assigned_by, start_time, end_time, due_date } = req.body;

//     // Convert start_time to Date object
//     const startTime = new Date(start_time);

//     // Create a new work detail
//     const workDetails = new Work({
//       work_id,
//       work_title,
//       work_description,
//       assigned_to,
//       assigned_by,
//       start_time: startTime, // Store startTime as a Date object
//       end_time,
//       due_date
//     });

//     // Save the work details to the database
//     const savedWork = await workDetails.save();

//     // Calculate reminder time 30 minutes before start_time
//     const reminderTime = calculateReminderTime(startTime);

//     // Generate audio from text message
//     const reminderMessage = `You have a work assignment "${work_title}" starting in 30 minutes. Please be prepared.`;
//     const audioFilePath = await generateAudioFromText(reminderMessage);

//     // Schedule the notification using a task scheduler (e.g., setTimeout)
//     const currentTime = new Date();
//     const timeToNotify = reminderTime - currentTime.getTime(); // Time in milliseconds until reminderTime

//     setTimeout(async () => {
//       // Send notification using FCM
//       await sendNotification(assigned_to, audioFilePath, reminderTime);
//     }, timeToNotify);

//     res.status(201).json(savedWork);
//   } catch (error) {
//     console.error('Error registering work:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

// module.exports = {
//   registerWork,
// };
