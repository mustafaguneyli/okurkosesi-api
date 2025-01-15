const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const UserBook = require('../models/UserBook');
const { auth, isAdmin } = require('../middleware/auth');
const mongoose = require('mongoose');

// Tüm kitapları getir
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/books isteği alındı');
    
    const books = await Book.find({}).sort({ title: 1 });
    console.log(`${books.length} kitap bulundu`);
    
    res.json(books);
  } catch (error) {
    console.error('Kitapları getirme hatası:', error);
    res.status(500).json({ 
      message: 'Kitaplar getirilirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Kitap ara - auth gerektirmez
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcının kitap listesini getir
router.get('/user-books', auth, async (req, res) => {
  try {
    const userBooks = await UserBook.find({ userId: req.user._id })
      .sort({ addedAt: -1 });
    res.json(userBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kitabı kullanıcının listesine ekle
router.post('/add-to-list', auth, async (req, res) => {
  try {
    const { bookId, title, author, description, genre, imageUrl, rating, publishYear } = req.body;
    
    // Kitap zaten ekli mi kontrol et
    const existingBook = await UserBook.findOne({
      userId: req.user._id,
      bookId
    });

    if (existingBook) {
      return res.status(400).json({ message: 'Bu kitap zaten listenizde var' });
    }

    const userBook = new UserBook({
      userId: req.user._id,
      bookId,
      title,
      author,
      description,
      genre,
      imageUrl,
      rating,
      publishYear
    });

    await userBook.save();
    res.status(201).json({ message: 'Kitap başarıyla listenize eklendi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kitabı kullanıcının listesinden sil
router.delete('/user-books/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const result = await UserBook.findOneAndDelete({
      userId: req.user._id,
      _id: bookId
    });

    if (!result) {
      return res.status(404).json({ message: 'Kitap bulunamadı' });
    }

    res.json({ message: 'Kitap başarıyla listeden kaldırıldı' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni kitap ekle (sadece admin)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    console.log('Yeni kitap ekleme isteği:', req.body);

    // Zorunlu alanları kontrol et
    const requiredFields = ['title', 'author', 'genre', 'description'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          message: `${field} alanı zorunludur` 
        });
      }
    }
    
    const book = new Book({
      ...req.body,
      addedAt: new Date()
    });

    const savedBook = await book.save();
    console.log('Yeni kitap başarıyla eklendi:', savedBook);
    
    res.status(201).json({
      message: 'Kitap başarıyla eklendi',
      book: savedBook
    });
  } catch (error) {
    console.error('Kitap ekleme hatası:', error);
    res.status(400).json({ 
      message: 'Kitap eklenirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Hava durumuna göre kitap önerileri
router.get('/recommendations/weather', async (req, res) => {
  try {
    const { weather } = req.query;
    let query = {};
    
    // Hava durumuna göre kitap türleri belirle
    switch (weather) {
      case 'güneşli':
        query.genre = { $in: ['Macera', 'Romantik', 'Gezi'] };
        break;
      case 'yağmurlu':
        query.genre = { $in: ['Şiir', 'Roman', 'Dram'] };
        break;
      case 'bulutlu':
        query.genre = { $in: ['Polisiye', 'Gizem', 'Fantastik'] };
        break;
      case 'karlı':
        query.genre = { $in: ['Klasik', 'Tarih', 'Biyografi'] };
        break;
      default:
        query = {};
    }

    const books = await Book.find(query)
      .sort({ rating: -1 })
      .limit(6);

    res.json(books);
  } catch (error) {
    console.error('Hava durumu bazlı öneri hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 