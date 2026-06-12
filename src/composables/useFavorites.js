//імпорт для створення реактивних даних
import { ref } from 'vue'

//назва ключа, під яким обране зберігається в браузері (в даному випадку "favorites")
const STORAGE_KEY = 'favorites'

//функція створення масива обраного (беремо дані з локалсторадж, які записані під нашим ключем та парсимо його в об'єкт)
const favorites = ref(
  JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
)

//функція, яка записує дані про обране в локалсторадж
const saveFavorites = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(favorites.value)
  )
}

//функція додавання міста в обране
const addFavorite = city => {
  // перевірка, чи існує вже таке місто в обраному
  const exists = favorites.value.some(
    item => item.name === city.name
  )

  if (exists) return false

  //перевірка кількості міст в обраному
  if (favorites.value.length >= 5) {
    return 'limit'
  }

  //якщо все ок, додаємо місто в масив
  favorites.value.push(city)
  //визиваємо функцію, яка записує змінні в локалсторадж
  saveFavorites()

  //успішно додали
  return true
}

//функція, яка видаляє місто з обраного за допомогою методу filter
const removeFavorite = cityName => {
  favorites.value = favorites.value.filter(
    city => city.name !== cityName
  )

  saveFavorites()
}

//функція, яка перевіряє, чи знаходиться місто в обраному
const isFavorite = cityName => {
  return favorites.value.some(
    city => city.name === cityName
  )
}

//створюємо composable (винесення логіки, що перевикористовується, в окремий модуль)
export const useFavorites = () => {
  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite
  }
}