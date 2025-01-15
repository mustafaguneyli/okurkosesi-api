const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/kitap-oneri';
const ATLAS_MONGODB_URI = process.env.MONGODB_URI;

async function migrateUsers() {
  try {
    // Local veritabanına bağlan
    const localConnection = await mongoose.createConnection(LOCAL_MONGODB_URI);
    console.log('Local MongoDB bağlantısı başarılı');

    // Local veritabanından kullanıcıları al
    const localUsers = await localConnection.db
      .collection('users')
      .find({})
      .toArray();
    console.log(`${localUsers.length} kullanıcı local veritabanından alındı`);

    // Atlas'a bağlan
    const atlasConnection = await mongoose.createConnection(ATLAS_MONGODB_URI);
    console.log('Atlas MongoDB bağlantısı başarılı');

    // Atlas'taki users koleksiyonunu temizle
    await atlasConnection.db.collection('users').deleteMany({});

    // Kullanıcıları Atlas'a aktar
    if (localUsers.length > 0) {
      const result = await atlasConnection.db
        .collection('users')
        .insertMany(localUsers);
      console.log(`${result.insertedCount} kullanıcı Atlas'a başarıyla aktarıldı`);
    }

    // Bağlantıları kapat
    await localConnection.close();
    await atlasConnection.close();
    console.log('İşlem tamamlandı');
  } catch (error) {
    console.error('Hata:', error);
  }
}

migrateUsers(); 