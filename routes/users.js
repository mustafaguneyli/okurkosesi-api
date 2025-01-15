const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login isteği alındı:', req.body);
    const { email, password } = req.body;

    // Email kontrolü
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Kullanıcı bulunamadı:', email);
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Şifre eşleşmedi:', email);
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    // Token oluştur
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Başarılı yanıt
    console.log('Login başarılı:', user.email);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin
      },
      message: 'Giriş başarılı'
    });
  } catch (error) {
    console.error('Login hatası:', error);
    res.status(500).json({ 
      message: 'Giriş yapılırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Register isteği alındı:', req.body);
    const { username, email, password } = req.body;

    // Email kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email zaten kayıtlı:', email);
      return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const user = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date()
    });

    const savedUser = await user.save();
    console.log('Yeni kullanıcı kaydedildi:', savedUser._id);

    // Token oluştur
    const token = jwt.sign(
      { id: savedUser._id, isAdmin: savedUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin
      },
      message: 'Kayıt başarılı'
    });
  } catch (error) {
    console.error('Register hatası:', error);
    res.status(500).json({ message: 'Kayıt olurken bir hata oluştu' });
  }
});

module.exports = router; 