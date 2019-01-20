const fs = require('fs');
const path = require('path');
const keys = require('./keys.js');
const mongoose = require('mongoose');
// set connection url for mongoose
mongoose.connect('mongodb://' + keys.mongoURI, { useNewUrlParser: true });
// require all files ending in .js from the models folder automatically
var models_path = path.join(__dirname, './../models');
fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf('.js') >= 0) {
    require(models_path + '/' + file);
   }
});
