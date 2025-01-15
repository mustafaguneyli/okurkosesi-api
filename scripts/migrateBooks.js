const mongoose = require('mongoose');
const Book = require('../models/Book');
require('dotenv').config();

// Eski (local) veritabanı bağlantısı
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/kitap-oneri';

// Yeni (Atlas) veritabanı bağlantısı
const ATLAS_MONGODB_URI = 'mongodb+srv://mustafaguneyli21:Mustafa123@cluster0.spesx.mongodb.net/kitap-oneri';

async function migrateBooks() {
  try {
    // Önce local veritabanına bağlan
    const localConnection = await mongoose.createConnection(LOCAL_MONGODB_URI);
    console.log('Local MongoDB bağlantısı başarılı');

    // Local veritabanından kitapları al
    const LocalBook = localConnection.model('Book', Book.schema);
    const books = await LocalBook.find({});
    console.log(`${books.length} kitap local veritabanından alındı`);

    // Atlas'a bağlan
    const atlasConnection = await mongoose.createConnection(ATLAS_MONGODB_URI);
    console.log('Atlas MongoDB bağlantısı başarılı');

    // Atlas'taki Book modelini oluştur
    const AtlasBook = atlasConnection.model('Book', Book.schema);

    // Mevcut kitapları temizle
    await AtlasBook.deleteMany({});

    // Kitapları Atlas'a aktar
    const result = await AtlasBook.insertMany(books);
    console.log(`${result.length} kitap Atlas'a başarıyla aktarıldı`);

    // Bağlantıları kapat
    await localConnection.close();
    await atlasConnection.close();
    
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

migrateBooks(); 