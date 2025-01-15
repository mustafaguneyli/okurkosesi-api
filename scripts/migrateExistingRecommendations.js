const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/kitap-oneri';
const ATLAS_MONGODB_URI = process.env.MONGODB_URI;

async function migrateExistingRecommendations() {
  try {
    // Local veritabanına bağlan
    const localConnection = await mongoose.createConnection(LOCAL_MONGODB_URI);
    console.log('Local MongoDB bağlantısı başarılı');

    // Local veritabanından önerileri al
    const localRecommendations = await localConnection.db
      .collection('öneriler')
      .find({})
      .toArray();
    console.log(`${localRecommendations.length} öneri local veritabanından alındı`);

    // Atlas'a bağlan
    const atlasConnection = await mongoose.createConnection(ATLAS_MONGODB_URI);
    console.log('Atlas MongoDB bağlantısı başarılı');

    // Atlas'taki öneriler koleksiyonunu temizle
    await atlasConnection.db.collection('öneriler').deleteMany({});

    // Önerileri Atlas'a aktar
    if (localRecommendations.length > 0) {
      const result = await atlasConnection.db
        .collection('öneriler')
        .insertMany(localRecommendations);
      console.log(`${result.insertedCount} öneri Atlas'a başarıyla aktarıldı`);
    }

    // Bağlantıları kapat
    await localConnection.close();
    await atlasConnection.close();
    console.log('İşlem tamamlandı');
  } catch (error) {
    console.error('Hata:', error);
  }
}

migrateExistingRecommendations(); 