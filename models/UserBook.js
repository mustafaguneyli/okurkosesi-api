const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  publishYear: {
    type: Number
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserBook', userBookSchema); 