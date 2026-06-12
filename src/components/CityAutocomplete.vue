<template>
  <!-- контейнер для випадаючого списку
       двостороння прив'язка даних
       виклик handleInput() при кожному оновленні інпута
  -->
  <div class="autocomplete">
    <input
      v-model="query"
      @input="handleInput"
      :placeholder="$t('selectCity')"
    />

    <!-- випадаючий список показуємо, тільки якщо міста є -->
    <ul
      v-if="cities.length"
      class="suggestions"
    >
    <!-- Vue проходить по масиву і створює <li> для кожного міста
         Vue використовує key (в якості унікального ключа елемента) для оптимізації рендеру
         при кліку на місто визивається функція вибору міста
      -->
      <li
        v-for="city in cities"
        :key="`${city.lat}-${city.lon}`"
        @click="selectCity(city)"
      >
        {{ city.name }}
        {{ city.state ? `, ${city.state}` : '' }}
        {{ city.country }}
      </li>
    </ul>
  </div>
</template>

<script setup>
//імпорт для реактивних змінних
import { ref } from 'vue'
//імпорт функції пошуку міста
import { searchCities } from '../api/weatherApi'
//імпорт для локалізації
import { useI18n } from 'vue-i18n'

//компонент, який сповіщає батьківський елемент про вибір міста
const emit = defineEmits(['select'])

//текст інпута
const query = ref('')
//перелік міст
const cities = ref([])

//змінна для debounce
let timeout = null

//функція пошуку
const handleInput = () => {
  clearTimeout(timeout)

  if (query.value.length < 2) {
    cities.value = []
    return
  }

  //реалізація debounce (для оптимізації, зменшення запросів на сервер)
  timeout = setTimeout(async () => {
    try {
      const response = await searchCities(query.value)
      cities.value = response.data
    } catch (error) {
      console.error(error)
    }
  }, 400)
}

//функція вибоу міста (збереженні по кліку)
const selectCity = city => {
  query.value = city.name
  cities.value = []

  emit('select', city)
}
</script>


//стилі
<style scoped>
.autocomplete {
  position: relative;
  z-index: 8;
}

input {
  width: 100%;
  min-height: 50px;
  border: 1px solid var(--line);
  border-radius: 999px;
  outline: none;
  padding: 0 18px 0 46px;
  color: var(--text-main);
  background:
    linear-gradient(var(--surface-strong), var(--surface-strong)) padding-box,
    linear-gradient(135deg, rgba(255, 158, 199, 0.7), rgba(128, 216, 255, 0.7)) border-box;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 10px 24px rgba(92, 75, 120, 0.08);
  font-weight: 800;
  transition: box-shadow var(--transition), border-color var(--transition);
}

.autocomplete::before {
  content: '🔎';
  position: absolute;
  left: 18px;
  top: 14px;
  z-index: 1;
}

input::placeholder {
  color: var(--text-soft);
}

input:focus {
  box-shadow: 0 0 0 5px rgba(255, 158, 199, 0.2), 0 12px 28px rgba(92, 75, 120, 0.12);
}

.suggestions {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  max-height: 260px;
  overflow: auto;
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 8px;
  list-style: none;
  background: var(--surface-strong);
  box-shadow: 0 20px 50px rgba(48, 38, 71, 0.2);
  backdrop-filter: blur(16px);
}

.suggestions li {
  border-radius: 16px;
  padding: 12px 14px;
  color: var(--text-main);
  font-weight: 800;
  cursor: pointer;
}

.suggestions li:hover {
  background: linear-gradient(135deg, rgba(255, 158, 199, 0.18), rgba(128, 216, 255, 0.18));
}
</style>
