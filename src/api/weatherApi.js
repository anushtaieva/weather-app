//імопрт бібліотеки axios для HTTP-запросів на сервер
import axios from 'axios'
//імпортуємо API ключ
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

//створюємо axios-клієнта
const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org'
})

//функція пошуку міста
export const searchCities = (query) => {
  return weatherApi.get('/geo/1.0/direct', {
    params: {
      q: query,
      limit: 5,
      appid: API_KEY
    }
  })
}

//функція отримання поточної погоди
export const getCurrentWeather = (
  lat, //координата широти
  lon, //координата довготи
  lang = 'uk'
) => {
  return weatherApi.get('/data/2.5/weather', {
    params: {
      lat,
      lon,
      units: 'metric',
      lang,
      appid: API_KEY
    }
  })
}

//функція отримання прогнозу на 5 днів
export const getForecast = (
  lat,
  lon,
  lang = 'uk'
) => {
  return weatherApi.get('/data/2.5/forecast', {
    params: {
      lat,
      lon,
      units: 'metric',
      lang,
      appid: API_KEY
    }
  })
}

//функція знаходження міста користувача
export const getUserLocationByIp = () => {
  return axios.get('https://ipapi.co/json/')
}