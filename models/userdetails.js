const mongoose = require('mongoose');
//emp schema
const EmpSchema = new mongoose.Schema(
  {
    emp_id: String,
    emp_name: String,
    emp_token: String,
    emp_phnnum: String,
    emp_emailid: String,
    emp_pswrd: String
  },
  { collection: 'users' }
);

module.exports = mongoose.model('Emp', EmpSchema, 'DIALOGUEFLOW.EMPLOYEE_DETAILS');


