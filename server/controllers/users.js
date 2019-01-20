const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const admin = require("firebase-admin");

module.exports =  {
  userSignup: function(req, res) {
    req.body.info = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      cellPhone: req.body.cellPhone,
      resetPasswordToken: "",
      pushNotificationToken: ""
    }

    let newUser = new User(req.body);
    newUser.save(function(err) {
      if(err) {
        res.status(422).json({"error":"user-exists"});
      } else {
        res.send(newUser);
      }
    });
  },

  userLogin: function(req, res) {
    const { username, password, os } = req.body;

    User.findOne({ "username": username }, function(err, user) {
      if(!user) {
        res.status(422).json({"error":"user-not-found"});
      } else {
        bcrypt.compare(password, user.password, (err, success) => {
          if(!success) {
            res.status(422).json({"error":"password-invalid"});
          } else {
            user.active = true;
            if(os) {
              user.os = os;
            }
            user.save().then((success, err) => {
              if(err) {
                res.status(422).json({"error":"user-not-found"});
              } else {
                res.status(200).send(user);
              }
            });
          }
        });
      }
    });
  },

  userLogout: function(req, res) {
    const { _id } = req.body;

    User.findById({ "_id": _id }, function(err, user) {
      if(!user) {
        res.status(422).json({"error":"user-not-found"});
      } else {
        user.active = false;
        user.save().then((success, err) => {
          if(err) {
            res.status(422).json({"error":"user-not-saved"});
          } else {
            res.status(200).send({"success":"user-logout-success"});
          }
        });
      }
    });
  },

  currentUser: function(req, res) {
    const { _id } = req.body;

    User.findById({ "_id": _id }, function(err, user) {
      if(!user) {
        res.status(422).json({"error":"user-not-found"});
      } else {
        res.status(200).send(user);
      }
    });
  },

  setPushNotificationToken: function(req, res) {
    let { _id, pushNotificationToken } = req.body;
    User.findById({ "_id": _id }, function(err, user) {
      if(!user) {
        res.status(422).json({"error":"user-not-found"});
      } else {
        user.pushNotificationToken = pushNotificationToken;
        user.save().then((success, err) => {
          if(err) {
            res.status(422).json({"error":"push-notification-token-not-saved"});
          } else {
            res.status(200).send(user);
          }
        });
      }
    })
  },

  sendPushNotification: function(req, res) {
    const { user_id, title } = req.body;
    User.findById({ "_id": user_id }, function(err, user) {
      if(user) {
        const message = {
          notification: {
            "title": title,
            "body": "Body of push notification message",
            "user_id": user_id,
          },
          data: {
            "title": title,
            "body": "Body of push notification message",
            "user_id": user_id,
          }
        }

        admin.messaging().sendToDevice(user.pushNotificationToken, message)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });

        res.status(200).send('sent-push-notification-successfully');
      } else {
        res.status(422).send({"error":"user-not-found"});
      }
    })
  },

}
