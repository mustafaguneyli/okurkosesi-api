const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const adminUser = {
  username: 'Mustafa',
  email: 'mustafa_guneyli21@erdogan.edu.tr',
  password: 'Mustafa123',
  isAdmin: true
};

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas bağlantısı başarılı');

    // Önce mevcut admin kullanıcısını kontrol et
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut:', existingAdmin);
      await mongoose.connection.close();
      return;
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Yeni admin kullanıcısı oluştur
    const newAdmin = new User({
      username: adminUser.username,
      email: adminUser.email,
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date()
    });

    const savedAdmin = await newAdmin.save();
    console.log('Admin kullanıcısı başarıyla oluşturuldu:', {
      id: savedAdmin._id,
      username: savedAdmin.username,
      email: savedAdmin.email,
      isAdmin: savedAdmin.isAdmin
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
  }
}

createAdmin(); 