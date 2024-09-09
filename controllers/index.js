// controllers/index.js
const express = require('express');
const employeeController = require('./empController');
const hrController = require('./HrController');
const workController = require('./workController');
const dfController = require('./dfController');

const router = express.Router();

router.use('/emp', employeeController);
router.use('/hr', hrController);
router.use('/work', workController);
router.use('/df',dfController);

module.exports = router;
