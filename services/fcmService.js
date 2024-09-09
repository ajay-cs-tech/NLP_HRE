const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;


admin.initializeApp({});

// Function to send FCM notification to a device
async function sendNotification(deviceToken, Title, body) {
  try {
    const message = {
      token: deviceToken,
      notification: {
        title: Title,
        body: body
      },
    };
    const response = await admin.messaging().send(message);
    console.log('Successfully sent FCM message:', response);
  } catch (error) {
    console.error('Error sending FCM message:', error);
    throw error;
  }
}

module.exports = {
  sendNotification,
};



// const title = 'Just a remainder call BHARGAV';
// const body = 'Go do SLEEP NOW.';
// const token = ''; // The FCM token of the device you want to send the notification to

// sendNotificationToToken(title, body, token)
//     .then(response => {
//         console.log('Notification sent successfully:', response);
//     })
//     .catch(error => {
//         console.error('Error sending notification:', error);
//     });