const mongoose = require('mongoose');
// HR schema
const HrSchema = new mongoose.Schema(
  {
    hr_id: String,
    hr_name: String,
    hr_token: String,
    hr_phnnum: String,
    hr_emailid: String,
    hr_pswrd: String
  },
  { collection: 'DIALOGUEFLOW.HR_DETAILS' }
);

module.exports = mongoose.model('Hr', HrSchema, 'DIALOGUEFLOW.HR_DETAILS');