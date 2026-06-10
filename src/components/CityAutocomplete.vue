<template>
  <div class="autocomplete">
    <input
      v-model="query"
      @input="handleInput"
      placeholder="Enter city"
    />

    <ul
      v-if="cities.length"
      class="suggestions"
    >
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
import { ref } from 'vue'
import { searchCities } from '../api/weatherApi'

const emit = defineEmits(['select'])

const query = ref('')
const cities = ref([])

let timeout = null

const handleInput = () => {
  clearTimeout(timeout)

  if (query.value.length < 2) {
    cities.value = []
    return
  }

  timeout = setTimeout(async () => {
    try {
      const response = await searchCities(query.value)
      cities.value = response.data
    } catch (error) {
      console.error(error)
    }
  }, 400)
}

const selectCity = city => {
  query.value = city.name
  cities.value = []

  emit('select', city)
}
</script>

<style scoped>
.autocomplete {
  position: relative;
}

input {
  width: 100%;
  padding: 10px;
}

.suggestions {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  list-style: none;
  z-index: 10;
}

.suggestions li {
  padding: 10px;
  cursor: pointer;
}

.suggestions li:hover {
  background: #f3f3f3;
}
</style>