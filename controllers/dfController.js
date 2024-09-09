// controllers/workController.js
const express = require('express');

//db
const Emp = require('../models/userdetails')
const Work = require('../models/workdetails');
const {registerWorkDetails} = require('../controllers/workController')
const router = express.Router();

async function registerwork(data){
    try {
        const { work_id, work_title, work_description, assigned_to, assigned_by, start_time, end_time, due_date } = data;
         
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
        return savedWork;
      } catch (error) {
        console.error('Error registering work:', error);
        return error.message;
      }
      
}

router.post('/webhook', async (req, res) => {
    console.log(JSON.stringify(req.body, 2, ''));
  
    const intent = req.body.queryResult.intent.displayName;
  
    switch (intent) {
      case 'calls':
        const Message = await insert("calls", "call@call.com");
res.send({
  fulfillmentText: Message
});
        break;
      case 'orders':
        const msg = await insert("new order","order@mail.com");
        res.send({
          fulfillmentText: msg
        });
        break;
        case 'AddWorkDetailsbyHR' : {
          const work_id = req.body.queryResult.parameters.work_id;
          const work_title = req.body.queryResult.parameters.work_title;
          const work_description = req.body.queryResult.parameters.work_des;
          const assigned_to = req.body.queryResult.parameters.emp_id;
          const assigned_by = req.body.queryResult.parameters.hr_id;
          const start_time = req.body.queryResult.parameters.st;
          const end_time = req.body.queryResult.parameters.et;
          const due_date = req.body.queryResult.parameters.due_date;
          const data = {work_id, work_title, work_description, assigned_to, assigned_by, start_time, end_time, due_date};
          const status = await registerwork(data);
          console.log(status);
         // await insert(workId, workName, workDuration);
          // Add logic to store the work details in your database
          // e.g., database.saveWorkDetails(workId, workName, workDuration);
  
          res.json({
              fulfillmentText: `Work Title: ${work_title} has been added successfully.`
          });
      } break;
      case 'getworkdetails':
  try {
    // Retrieve the employee ID from the request
    const employ = req.body.queryResult.parameters.emp_id;

    // Fetch work details assigned to the specified employee
    const works = await Work.find({ assigned_to: employ });

    // Check if any work details are found
    if (!works || works.length === 0) {
      res.send({
        fulfillmentText: 'You don\'t have any work assigned.'
      });
    } else {
      // Format the work details into a readable string
      const limitedWorks = works.slice(0, 5);

      // Format the work details into a readable string
      let workDetails = 'Here are your assigned works:\n';
      limitedWorks.forEach(work => {
        workDetails += `- ${work.title} (Due: ${work.due_date})\n`;
      });
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching work details:', error);
    res.send({
      fulfillmentText: 'An error occurred while fetching work details.'
    });
  }
  break;

      default:
        res.send({
          fulfillmentText: 'Simple response from webhook.'
        });
    }
  });

module.exports = router;