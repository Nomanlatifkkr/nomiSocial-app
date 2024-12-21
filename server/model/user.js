const mongoose = require('mongoose');
const Story=require('./Story.js')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true, 
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio:{
    type:String,
  },
  createdOn: {
    type: Date,
    default: Date.now, // Default to the current date and time
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to other users
}],
following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
story:[{
  type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
}],
images: {
  publicId: String, // Fixed typo from `publiId`
  url: String,
},
});


const User = mongoose.model('User', userSchema);

module.exports = User;
