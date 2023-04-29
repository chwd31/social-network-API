const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema({
  thoughtText: { type: String, required: true },
  username: { type: String, required: true },
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }],
}, { timestamps: true });

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
