const mongoose = require('mongoose');
require('dotenv').config();

const initialRecommendations = [
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "Bilimkurgu edebiyatının başyapıtlarından olan Dune, çöl gezegeni Arrakis...",
    genre: "Bilim Kurgu",
    imageUrl: "https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg",
    rating: 4.8,
    publishYear: 1965,
    recommendedCount: 150
  },
  {
    title: "Yüzüklerin Efendisi",
    author: "J.R.R. Tolkien",
    description: "Orta Dünya'da geçen, iyi ile kötünün mücadelesini anlatan fantastik bir...",
    genre: "Fantastik",
    imageUrl: "https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg",
    rating: 4.9,
    publishYear: 1954,
    recommendedCount: 200
  },
  {
    title: "Sefiller",
    author: "Victor Hugo",
    description: "Jean Valjean'ın hikayesi üzerinden adalet, merhamet ve kurtuluş teması...",
    genre: "Klasik",
    imageUrl: "https://m.media-amazon.com/images/I/71jLBXtWJWL._AC_UF1000,1000_QL80_.jpg",
    rating: 4.7,
    publishYear: 1862,
    recommendedCount: 180
  }
];

async function migrateRecommendations() {
  try {
    // Atlas'a bağlan
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas bağlantısı başarılı');

    // öneriler koleksiyonunu seç
    const collection = mongoose.connection.db.collection('öneriler');

    // Mevcut önerileri temizle
    await collection.deleteMany({});
    console.log('Mevcut öneriler temizlendi');

    // Yeni önerileri ekle
    const result = await collection.insertMany(initialRecommendations);
    console.log(`${result.insertedCount} öneri başarıyla eklendi`);

    // Eklenen önerileri kontrol et
    const recommendations = await collection.find({}).toArray();
    console.log('Eklenen öneriler:', recommendations);

    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
  } catch (error) {
    console.error('Hata:', error);
  }
}

migrateRecommendations(); 