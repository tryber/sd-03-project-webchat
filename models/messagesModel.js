const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message: { type: String, require: true },
  nick: { type: String, require: true },
  date: {
    type: String,
  },
  room: {
    type: String,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
