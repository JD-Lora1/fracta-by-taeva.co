const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});

exports.app = functions.https.onRequest(app);
