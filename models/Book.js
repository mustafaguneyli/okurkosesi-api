const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Kitap başlığı zorunludur'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Yazar adı zorunludur'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Kitap açıklaması zorunludur'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Kitap türü zorunludur'],
    trim: true
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  publishYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear()
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'books',
  timestamps: true
});

// Kitap başlığı ve yazar için index oluştur
bookSchema.index({ title: 1, author: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema); 