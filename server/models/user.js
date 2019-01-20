const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  cellPhone: { type: String },
  active: { type: Boolean },
  os: { type: String },
  resetPasswordToken: { type: String },
  pushNotificationToken: { type: String },
}, {
  timestamps: true
});
const UserModel = mongoose.model('User', UserSchema);

UserSchema.pre('save', function(next) {
  UserModel.findOne({$or: [{'email': this.email}, {'username': this.username}]}, (err, results) => {
    if(err) {
      next(err);
    } else if(results && this.isNew) {
      this.invalidate('username', 'username must be unique');
      this.invalidate('email', 'email must be unique');
      next(new Error('email and username must be unique'));
    } else {
      next();
    }
  });
});

UserSchema.pre('save', function(next) {
  if(this.isModified('password')) {
    bcrypt.hash(this.password, 10)
    .then((hash, err) => {
      if (err) console.log(err);
      this.password = hash;
      next();
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
  } else {
    return next();
  }
});

UserSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password)
};

module.exports = UserSchema;
