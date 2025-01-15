const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = 'mongodb+srv://mustafaguneyli21:Mustafa123@cluster0.spesx.mongodb.net/kitap-oneri?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Atlas bağlantısı başarılı');
    
    // Koleksiyonları listele
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Mevcut koleksiyonlar:', collections.map(c => c.name));
    
    // Kitapları say
    const bookCount = await mongoose.connection.db.collection('books').countDocuments();
    console.log('Kitap sayısı:', bookCount);

    await mongoose.connection.close();
    console.log('Bağlantı başarıyla kapatıldı');
  } catch (error) {
    console.error('Bağlantı hatası:', error);
  }
}

testConnection(); 