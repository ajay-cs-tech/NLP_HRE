// controllers/hrController.js
const express = require('express');
const bcrypt = require('bcrypt');
const HRDetails = require('../models/hrdetails');

const router = express.Router();

// POST route to register an HR
router.post('/reg', async (req, res) => {
  try {
    const { id, name, token, num, email, pswrd } = req.body;

    // Encrypt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pswrd, saltRounds);

    // Create a new HR detail with the hashed password
    const hr = new HRDetails({
      hr_id: id,
      hr_name: name,
      hr_token: token,
      hr_phnnum: num,
      hr_emailid: email,
      hr_pswrd: hashedPassword
    });

    // Save the HR details to the database
    const status = await hr.save();
    console.log(status);

    res.status(201).json(hr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route to log in an HR
router.post('/log', async (req, res) => {
  try {
    const { email, pswrd } = req.body;

    // Find the HR by email
    const hr = await HRDetails.findOne({ hr_emailid: email });

    if (!hr) {
      return res.status(404).json({ error: 'HR not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(pswrd, hr.hr_pswrd);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
