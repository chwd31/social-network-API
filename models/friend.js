const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
