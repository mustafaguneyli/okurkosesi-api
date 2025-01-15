const mongoose = require('mongoose');
const Book = require('../models/Book');

const MONGODB_URI = 'mongodb+srv://mustafaguneyli21:Mustafa123@cluster0.spesx.mongodb.net/kitap-oneri?retryWrites=true&w=majority&appName=Cluster0';

const books = [
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
  },
  {
    title: "Harry Potter ve Felsefe Taşı",
    author: "J.K. Rowling",
    description: "Genç bir büyücünün maceralarını anlatan fantastik roman.",
    genre: "Fantastik",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000052431-1.jpg",
    rating: 4.7,
    publishYear: 1997
  },
  {
    title: "Da Vinci Şifresi",
    author: "Dan Brown",
    description: "Tarihi sırları konu alan gerilim romanı.",
    genre: "Gerilim",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000061898-1.jpg",
    rating: 4.5,
    publishYear: 2003
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "Uzak bir gelecekte geçen bilim kurgu klasiği.",
    genre: "Bilim Kurgu",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0001917142001-1.jpg",
    rating: 4.6,
    publishYear: 1965
  },
  {
    title: "Sefiller",
    author: "Victor Hugo",
    description: "Jean Valjean'ın hikayesini anlatan klasik roman.",
    genre: "Klasik",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000058750-1.jpg",
    rating: 4.8,
    publishYear: 1862
  },
  {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    description: "Ünlü dedektifin maceralarını anlatan klasik seri.",
    genre: "Macera",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0001789624001-1.jpg",
    rating: 4.6,
    publishYear: 1887
  },
  {
    title: "Hobbit",
    author: "J.R.R. Tolkien",
    description: "Bilbo Baggins'in beklenmedik yolculuğunu anlatan roman.",
    genre: "Fantastik",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0001788074001-1.jpg",
    rating: 4.7,
    publishYear: 1937
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    description: "Kitapların yasaklandığı distopik bir gelecek.",
    genre: "Bilim Kurgu",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000065287-1.jpg",
    rating: 4.5,
    publishYear: 1953
  }
];

async function updateBooks() {
  try {
    console.log('MongoDB Atlas bağlantısı kuruluyor...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Atlas bağlantısı başarılı');

    // Mevcut kitapları sil
    await Book.deleteMany({});
    console.log('Mevcut kitaplar silindi');

    // Yeni kitapları ekle
    const result = await Book.insertMany(books);
    console.log(`${result.length} kitap başarıyla eklendi`);

    await mongoose.connection.close();
    console.log('İşlem tamamlandı ve bağlantı kapatıldı');
  } catch (error) {
    console.error('Hata:', error);
  }
}

updateBooks(); 