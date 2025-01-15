const mongoose = require('mongoose');
const Book = require('../models/Book');

const MONGODB_URI = 'mongodb+srv://mustafaguneyli21:Mustafa123@cluster0.spesx.mongodb.net/kitap-oneri?retryWrites=true&w=majority&appName=Cluster0';

async function syncDatabase() {
  try {
    console.log('MongoDB Atlas bağlantısı kuruluyor...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'kitap-oneri'
    });
    console.log('Bağlantı başarılı');

    // Atlas'taki koleksiyonu kontrol et
    const atlasBooks = await mongoose.connection.db
      .collection('books')
      .find({})
      .toArray();
    
    console.log(`Atlas'ta ${atlasBooks.length} kitap bulundu`);

    // Mevcut koleksiyonu temizle
    await Book.deleteMany({});
    console.log('Mevcut kitaplar temizlendi');

    // Atlas'taki kitapları aktar
    if (atlasBooks.length > 0) {
      const result = await Book.insertMany(atlasBooks);
      console.log(`${result.length} kitap başarıyla senkronize edildi`);
    }

    // Senkronize edilen kitapları kontrol et
    const syncedBooks = await Book.find();
    console.log('Senkronize edilen kitaplar:', syncedBooks);

    await mongoose.connection.close();
    console.log('İşlem tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

syncDatabase(); 