<template>
  <div class="weather-block">

    <button
        class="delete-btn"
        @click="$emit('remove', blockId)"
    >
        ×
    </button>

    <CityAutocomplete
      @select="loadWeather"
    />

    <div v-if="loading">
      Loading...
    </div>

    <div
      v-if="weather"
      class="weather-card"
    >
      <h2>{{ weather.name }}</h2>

      <img
        :src="iconUrl"
        alt=""
      />

      <p>
        {{ weather.main.temp }} °C
      </p>

      <p>
        Feels like:
        {{ weather.main.feels_like }} °C
      </p>

      <p>
        Humidity:
        {{ weather.main.humidity }}%
      </p>

      <p>
        Wind:
        {{ weather.wind.speed }} m/s
      </p>
    </div>
  </div>
</template>

<script setup>

import { computed, ref } from 'vue'

import CityAutocomplete from './CityAutocomplete.vue'

import { getCurrentWeather } from '../api/weatherApi'

const weather = ref(null)
const loading = ref(false)

const iconUrl = computed(() => {
  if (!weather.value) return ''

  return `https://openweathermap.org/img/wn/${weather.value.weather[0].icon}@2x.png`
})

const props = defineProps({
  blockId: {
    type: String,
    required: true
  }
})

defineEmits(['remove'])

const loadWeather = async city => {
  try {
    loading.value = true

    const response =
      await getCurrentWeather(
        city.lat,
        city.lon
      )

    weather.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.weather-block {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;

  border: none;
  background: none;
  cursor: pointer;
  font-size: 20px;
}
</style>