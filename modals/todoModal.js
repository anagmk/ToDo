const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now // This handles "2026-03-15" automatically
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  }
});

module.exports = mongoose.model('Task', TaskSchema);
