const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const admin = require("firebase-admin");

// used to initialize the setup for enabling firebase functionality
// such as push notifications
// const serviceAccount = require("./server/config/firebaseadminconfigfile.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "firebase-project-url"
// });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
require('./server/config/mongoose.js')
require('./server/routes/users.js')(app);

app.use(express.static('client/build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
})

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, function(){
  console.log("Server is listening on port: " + PORT);
});

const io = require('socket.io')(server);
