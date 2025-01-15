const axios = require('axios');

const getWeather = async (city = 'Rize') => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=tr`
    );
    
    const weatherCondition = response.data.weather[0].main.toLowerCase();
    let recommendedGenre;

    // Hava durumuna göre kitap türü belirleme
    switch (weatherCondition) {
      case 'rain':
      case 'drizzle':
        recommendedGenre = 'Roman';
        break;
      case 'snow':
        recommendedGenre = 'Fantastik';
        break;
      case 'clear':
        recommendedGenre = 'Klasik';
        break;
      case 'clouds':
        recommendedGenre = 'Bilim Kurgu';
        break;
      case 'thunderstorm':
        recommendedGenre = 'Gerilim';
        break;
      default:
        recommendedGenre = 'Klasik';
    }

    return {
      weather: weatherCondition,
      temperature: Math.round(response.data.main.temp),
      recommendedGenre
    };
  } catch (error) {
    console.error('Hava durumu bilgisi alınamadı:', error);
    return {
      weather: 'unknown',
      temperature: null,
      recommendedGenre: 'Klasik'
    };
  }
};

module.exports = { getWeather }; 