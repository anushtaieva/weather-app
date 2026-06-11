import { ref } from 'vue'

const STORAGE_KEY = 'favorites'

const favorites = ref(
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
)

const saveFavorites = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(favorites.value)
  )
}

const addFavorite = city => {
  const exists = favorites.value.some(
    item => item.name === city.name
  )

  if (exists) return false

  if (favorites.value.length >= 5) {
    return 'limit'
  }

  favorites.value.push(city)
  saveFavorites()

  return true
}

const removeFavorite = cityName => {
  favorites.value = favorites.value.filter(
    city => city.name !== cityName
  )

  saveFavorites()
}

const isFavorite = cityName => {
  return favorites.value.some(
    city => city.name === cityName
  )
}

export const useFavorites = () => {
  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  }
}