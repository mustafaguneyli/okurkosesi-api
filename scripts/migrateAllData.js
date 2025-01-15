const mongoose = require('mongoose');
require('dotenv').config();

// Modelleri import et
const Book = require('../models/Book');
const User = require('../models/User');
const UserBook = require('../models/UserBook');
const Recommendation = require('../models/Recommendation');

// Bağlantı URL'leri
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/kitap-oneri';
const ATLAS_MONGODB_URI = 'mongodb+srv://mustafaguneyli21:Mustafa123@cluster0.spesx.mongodb.net/kitap-oneri';

async function migrateCollection(localDb, atlasDb, collectionName, Model) {
  try {
    // Local veritabanından verileri al
    const LocalModel = localDb.model(collectionName, Model.schema);
    const data = await LocalModel.find({});
    console.log(`${data.length} ${collectionName} local veritabanından alındı`);

    // Atlas'taki modeli oluştur
    const AtlasModel = atlasDb.model(collectionName, Model.schema);
    
    // Mevcut verileri temizle
    await AtlasModel.deleteMany({});
    
    // Verileri aktar
    if (data.length > 0) {
      const result = await AtlasModel.insertMany(data);
      console.log(`${result.length} ${collectionName} Atlas'a başarıyla aktarıldı`);
    }
  } catch (error) {
    console.error(`${collectionName} aktarımında hata:`, error);
  }
}

async function migrateAllData() {
  try {
    // Local veritabanına bağlan
    const localConnection = await mongoose.createConnection(LOCAL_MONGODB_URI);
    console.log('Local MongoDB bağlantısı başarılı');

    // Atlas'a bağlan
    const atlasConnection = await mongoose.createConnection(ATLAS_MONGODB_URI);
    console.log('Atlas MongoDB bağlantısı başarılı');

    // Tüm koleksiyonları aktar
    await migrateCollection(localConnection, atlasConnection, 'books', Book);
    await migrateCollection(localConnection, atlasConnection, 'users', User);
    await migrateCollection(localConnection, atlasConnection, 'userbooks', UserBook);
    await migrateCollection(localConnection, atlasConnection, 'recommendations', Recommendation);

    // Bağlantıları kapat
    await localConnection.close();
    await atlasConnection.close();
    console.log('Tüm veriler başarıyla aktarıldı');
    
    process.exit(0);
  } catch (error) {
    console.error('Genel hata:', error);
    process.exit(1);
  }
}

// Aktarımı başlat
migrateAllData(); 