// external packages
const path = require('path');
const express = require('express');
const cors = require('cors');

// internal packages
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
//const workController = require('./controllers/workController');
const controllers = require('./controllers');

const connectToMongoDB = require('./config/database');

// TESTING
const User = require('./models/usermodel');

require('dotenv').config();

// Start the webapp
const webApp = express();

webApp.use(cors());
webApp.use(bodyParser.json());

// Webapp settings
webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

// Server Port
const PORT = process.env.PORT;

//connect to db
connectToMongoDB();
  
webApp.use('/api', controllers);

// Home route
webApp.get('/', (req, res) => {
    res.send(`Hello.. The Server is running...!`);
   
});

webApp.get('/call' , (req, res) => {
  const filePath = path.join(__dirname, 'call.mp3');
 
  // Send the file to the client
  res.sendFile(filePath, (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('An error occurred while sending the file');
      }
      else{
        console.log('File sent successfully');
      }
  });
});

let messages = [];

webApp.post('/api/msg/send', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const newMessage = {
    id: messages.length + 1,
    message,
    timestamp: new Date().toISOString(),
  };

  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// Endpoint to receive messages
webApp.get('/api/msg/rec', (req, res) => {
  res.json(messages);
});

async function insert(emailid, token){
  try {
    await User.create({
      emailid: emailid,
      tokenid: token
    });
    console.log('User ' + emailid + ' with token ' + token + ' inserted successfully!');
    return 'User ' + emailid + ' with token ' + token + ' inserted successfully! ';

  } catch (err) {
    console.error(`Error inserting user ${emailid} with token ${token}:`, err);
    return 'Error inserting ' + emailid + ' with token ' + token + err;
  }
}

webApp.post('/posttoken' ,async (req, res) => {
  const tokens = req.body.token;
  const id1 = req.body.id;
    console.log('Received FCM token and id:', id1 );
   
    console.log('inserted successfully');
});


// Start the server
webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});
