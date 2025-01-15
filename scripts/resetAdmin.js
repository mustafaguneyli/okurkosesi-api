const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas bağlantısı başarılı');

    // Eski admin kullanıcısını sil
    await User.deleteOne({ email: 'mustafa_guneyli21@erdogan.edu.tr' });
    console.log('Eski admin kullanıcısı silindi');

    // Yeni admin bilgileri
    const adminUser = {
      username: 'Mustafa',
      email: 'mustafa_guneyli21@erdogan.edu.tr',
      password: 'Mustafa123',
      isAdmin: true,
      createdAt: new Date()
    };

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Yeni admin kullanıcısı oluştur
    const newAdmin = new User({
      ...adminUser,
      password: hashedPassword
    });

    const savedAdmin = await newAdmin.save();
    console.log('Yeni admin kullanıcısı oluşturuldu:', {
      id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email,
      isAdmin: savedAdmin.isAdmin,
      password: 'Mustafa123' // Giriş için kullanılacak şifre
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
  }
}

resetAdmin(); 