const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
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
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema, 'öneriler'); 