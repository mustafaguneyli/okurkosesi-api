const mongoose = require('mongoose');
const Book = require('../models/Book');
require('dotenv').config();

const initialBooks = [
  {
    title: "1984",
    author: "George Orwell",
    description: "Distopik bir gelecekte geçen klasik roman",
    genre: "Roman",
    imageUrl: "https://m.media-amazon.com/images/I/81StSOpmkjL._AC_UF1000,1000_QL80_.jpg",
    rating: 4.5,
    publishYear: 1949
  },
  {
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    description: "Psikolojik gerilim türünde klasik bir başyapıt",
    genre: "Klasik",
    imageUrl: "https://img.kitapyurdu.com/v1/getImage/fn:11454740/wh:true/wi:800",
    rating: 4.8,
    publishYear: 1866
  },
  {
    title: "Yüzüklerin Efendisi",
    author: "J.R.R. Tolkien",
    description: "Epik fantastik kurgu türünün en önemli eserlerinden",
    genre: "Fantastik",
    imageUrl: "https://i.dr.com.tr/cache/600x600-0/originals/0000000064552-1.jpg",
    rating: 4.9,
    publishYear: 1954
  }
];

async function addInitialBooks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Koleksiyonu temizle
    await Book.deleteMany({});
    console.log('Mevcut kitaplar temizlendi');

    // Yeni kitapları ekle
    const result = await Book.insertMany(initialBooks);
    console.log(`${result.length} kitap başarıyla eklendi`);

    // Eklenen kitapları kontrol et
    const books = await Book.find();
    console.log('Veritabanındaki kitaplar:', books);

    mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
  }
}

addInitialBooks(); 