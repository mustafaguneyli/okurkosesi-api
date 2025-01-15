const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const corsMiddleware = require('./middleware/cors');

// Environment variables
dotenv.config();

// Express app
const app = express();

// MongoDB bağlantı URL'i
const MONGODB_URI = 'mongodb+srv://mustafaguneyli21:Mustafa123@cluster0.spesx.mongodb.net/kitap-oneri?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB bağlantısı
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  dbName: 'kitap-oneri'
})
.then(async () => {
  console.log('MongoDB Atlas bağlantısı başarılı');
  
  try {
    // Bağlantı başarılı olduğunda koleksiyonları kontrol et
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Mevcut koleksiyonlar:', collections.map(c => c.name));
    
    // Books koleksiyonunu kontrol et
    const bookCount = await mongoose.connection.db.collection('books').countDocuments();
    console.log('Mevcut kitap sayısı:', bookCount);
  } catch (error) {
    console.error('Koleksiyon kontrolü sırasında hata:', error);
  }
})
.catch(err => {
  console.error('MongoDB bağlantı hatası:', err);
  process.exit(1);
});

// Bağlantı durumunu izle
mongoose.connection.on('connected', () => {
  console.log('Mongoose bağlantısı kuruldu');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose bağlantı hatası:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose bağlantısı kesildi');
});

// CORS ayarları
app.use(cors({
  origin: [
    'https://static-w95x.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

app.use(
  cors({
    origin: allowedOrigin,
  })
);

// CORS Preflight istekleri için
app.options('*', cors());
app.use(cors({
  origin: "*",
}));

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug için gelen istekleri logla
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/users', require('./routes/users'));
app.use('/api/recommendations', require('./routes/recommendations'));

// Basit test endpoint'i
app.get('/test', (req, res) => {
  res.json({ message: 'Backend çalışıyor', dbStatus: mongoose.connection.readyState });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Hata:', err.stack);
  res.status(500).json({ 
    message: err.message || 'Sunucu hatası!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Port ayarı
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
});

// Uygulama kapatıldığında MongoDB bağlantısını düzgün şekilde kapat
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB bağlantısı kapatılırken hata:', err);
    process.exit(1);
  }
});

// MongoDB bağlantı testi
mongoose.connection.once('open', async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Mevcut koleksiyonlar:', collections.map(c => c.name));
    
    const bookCount = await mongoose.connection.db.collection('books').countDocuments();
    console.log('Kitap sayısı:', bookCount);
  } catch (error) {
    console.error('Veritabanı kontrol hatası:', error);
  }
}); 