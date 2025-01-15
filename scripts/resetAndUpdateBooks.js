const mongoose = require('mongoose');
const Book = require('../models/Book');

const MONGODB_URI = 'mongodb+srv://mustafaguneyli21:Mustafa123@cluster0.spesx.mongodb.net/kitap-oneri?retryWrites=true&w=majority&appName=Cluster0';

const initialBooks = [
  {
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    description: "Raskolnikov'un psikolojik gerilimini anlatan klasik bir başyapıt.",
    genre: "Roman",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000064031-1.jpg",
    rating: 4.8,
    publishYear: 1866
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "Distopik bir gelecekte totaliter bir rejimi anlatan roman.",
    genre: "Bilim Kurgu",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000064038-1.jpg",
    rating: 4.7,
    publishYear: 1949
  },
  {
    title: "Yüzüklerin Efendisi",
    author: "J.R.R. Tolkien",
    description: "Orta Dünya'da geçen epik fantastik roman serisi.",
    genre: "Fantastik",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0001788076001-1.jpg",
    rating: 4.9,
    publishYear: 1954
  }
  // Diğer kitaplar...
];

async function resetAndUpdateBooks() {
  try {
    console.log('MongoDB Atlas bağlantısı kuruluyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('Bağlantı başarılı');

    // Koleksiyonu temizle
    await Book.deleteMany({});
    console.log('Mevcut kitaplar temizlendi');

    // Yeni kitapları ekle
    const result = await Book.insertMany(initialBooks);
    console.log(`${result.length} kitap başarıyla eklendi`);

    // Eklenen kitapları kontrol et
    const books = await Book.find();
    console.log('Veritabanındaki kitaplar:', books);

    await mongoose.connection.close();
    console.log('İşlem tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

resetAndUpdateBooks(); 