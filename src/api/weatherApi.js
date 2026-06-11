import axios from 'axios'

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org'
})

export const searchCities = (query) => {
  return weatherApi.get('/geo/1.0/direct', {
    params: {
      q: query,
      limit: 5,
      appid: API_KEY
    }
  })
}

export const getCurrentWeather = (
  lat,
  lon,
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

export const getUserLocationByIp = () => {
  return axios.get('https://ipapi.co/json/')
}