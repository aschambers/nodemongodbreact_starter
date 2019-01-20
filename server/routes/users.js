const users = require('../controllers/users.js');

module.exports = function(app){
  app.post('/api/userSignup', users.userSignup);
  app.post('/api/userLogin', users.userLogin);
  app.post('/api/userLogout', users.userLogout);
  app.put('/api/setPushNotificationToken', users.setPushNotificationToken);

}
