const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const axios = require('axios');

// OpenWeatherMap API anahtarı
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const CITY = 'Rize';

router.get('/', async (req, res) => {
  try {
    console.log('Öneriler ve hava durumu isteği alındı');
    
    let weather;
    try {
      // Hava durumu bilgisini al
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric&lang=tr`
      );

      const weatherData = weatherResponse.data;
      weather = {
        city: CITY,
        temperature: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main.toLowerCase(),
        description: weatherData.weather[0].description
      };
    } catch (weatherError) {
      console.error('Hava durumu alınamadı:', weatherError);
      weather = {
        city: CITY,
        temperature: 20,
        condition: 'clouds',
        description: 'parçalı bulutlu'
      };
    }

    // Kitap önerilerini getir
    const { genre } = req.query;
    let query = {};
    
    // Tür filtresi
    if (genre && genre !== 'Tümü') {
      query.genre = genre;
    }

    // Hava durumuna göre tür önerisi
    let recommendedGenre = 'Roman';
    switch (weather.condition) {
      case 'clear':
        recommendedGenre = 'Macera';
        break;
      case 'clouds':
        recommendedGenre = 'Fantastik';
        break;
      case 'rain':
        recommendedGenre = 'Roman';
        break;
      case 'snow':
        recommendedGenre = 'Bilim Kurgu';
        break;
      default:
        recommendedGenre = 'Klasik';
    }

    // Koleksiyondan direkt sorgu yap
    const recommendations = await Book.find(query).lean();

    console.log('Bulunan kitap sayısı:', recommendations.length);
    if (recommendations.length > 0) {
      console.log('Örnek kitap:', recommendations[0]);
    }

    res.json({
      recommendations,
      weather: {
        ...weather,
        recommendedGenre
      }
    });

  } catch (error) {
    console.error('Öneriler hatası:', error);
    res.json({ 
      recommendations: [],
      weather: {
        city: CITY,
        temperature: 20,
        condition: 'clouds',
        description: 'parçalı bulutlu',
        recommendedGenre: 'Roman'
      }
    });
  }
});

module.exports = router; 