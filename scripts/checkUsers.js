const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas bağlantısı başarılı');

    // Tüm kullanıcıları getir
    const users = await User.find({});
    console.log('Toplam kullanıcı sayısı:', users.length);

    // Admin kullanıcıları listele
    const adminUsers = users.filter(user => user.isAdmin);
    console.log('\nAdmin kullanıcıları:');
    adminUsers.forEach(admin => {
      console.log({
        id: admin._id,
        username: admin.username,
        email: admin.email,
        isAdmin: admin.isAdmin
      });
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
  }
}

checkUsers(); 