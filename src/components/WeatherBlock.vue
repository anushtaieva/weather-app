<template>
  <div class="weather-block">
    <button
      v-if="showDelete"
      class="delete-btn"
      @click="emit('remove', blockId)"
    >
      ×
    </button>

    <CityAutocomplete
      v-if="!favoriteCity"
      @select="city => loadWeather(city, true)"
    />

    <div class="view-switcher">
      <button
        :class="{ active: viewMode === 'day' }"
        @click="viewMode = 'day'"
      >
        {{ $t('today') }}
      </button>

      <button
        :class="{ active: viewMode === 'week' }"
        @click="viewMode = 'week'"
      >
        {{ $t('fiveDays') }}
      </button>
    </div>

    <Loader v-if="loading" />

    <div
      v-if="!weather && !loading"
      class="empty-state"
    >
      {{ $t('selectCity') }}
    </div>

    <div
      v-if="weather"
      class="weather-card"
    >
      <div class="weather-header">
        <div>
          <h2>{{ weather.name }}</h2>

          <p class="description">
            {{ weather.weather[0].description }}
          </p>
        </div>

        <img
          :src="iconUrl"
          :alt="weather.weather[0].description"
        />
      </div>

      <div class="temperature-row">
        <div class="temperature">
          {{
            viewMode === 'day'
              ? Math.round(weather.main.temp)
              : Math.round(weekTemps[0] || 0)
          }}°
        </div>

        <div class="weather-actions">
          <button
            class="favorite-btn"
            :class="{ active: isFavorite(weather.name) }"
            @click="toggleFavorite"
          >
            <span class="favorite-icon">
              {{ isFavorite(weather.name) ? '★' : '♡' }}
            </span>

            <span>
              {{ isFavorite(weather.name) ? $t('favoriteAdded') : $t('favoriteAdd') }}
            </span>
          </button>
        </div>
      </div>

      <div class="weather-info">
        <div class="info-item">
          <span>{{ $t('feelsLike') }}</span>
          <strong>{{ Math.round(weather.main.feels_like) }}°</strong>
        </div>

        <div class="info-item">
          <span>{{ $t('humidity') }}</span>
          <strong>{{ weather.main.humidity }}%</strong>
        </div>

        <div class="info-item">
          <span>{{ $t('wind') }}</span>
          <strong>{{ weather.wind.speed }} m/s</strong>
        </div>

        <div class="info-item">
          <span>{{ $t('pressure') }}</span>
          <strong>{{ weather.main.pressure }} hPa</strong>
        </div>
      </div>
    </div>

    <WeatherChart
      v-if="forecast.length"
      :labels="viewMode === 'day' ? chartLabels : weekLabels"
      :temperatures="viewMode === 'day' ? chartTemps : weekTemps"
    />
  </div>

  <Teleport to="body">
    <div
      v-if="showFavoriteLimitModal"
      class="modal-overlay"
    >
      <div class="modal">
        <p>
          {{ $t('favoriteLimit') }}
        </p>

        <div class="actions">
          <button
            @click="showFavoriteLimitModal = false"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  watch
} from 'vue'

import { useI18n } from 'vue-i18n'

import CityAutocomplete from './CityAutocomplete.vue'
import WeatherChart from './WeatherChart.vue'
import Loader from './Loader.vue'

import {
  getCurrentWeather,
  getForecast
} from '../api/weatherApi'

import {
  useFavorites
} from '../composables/useFavorites'

const props = defineProps({
  blockId: {
    type: String,
    required: true
  },

  favoriteCity: {
    type: Object,
    default: null
  },

  defaultCity: {
    type: Object,
    default: null
  },

  showDelete: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'remove',
  'city-change'
])

const { locale } = useI18n()

const {
  addFavorite,
  removeFavorite,
  isFavorite
} = useFavorites()

const forecast = ref([])
const weather = ref(null)
const loading = ref(false)
const viewMode = ref('day')
const showFavoriteLimitModal = ref(false)

const iconUrl = computed(() => {
  if (!weather.value) return ''

  return `https://openweathermap.org/img/wn/${weather.value.weather[0].icon}@2x.png`
})

const loadWeather = async (city, shouldSave = true) => {
  try {
    loading.value = true

    const [weatherResponse, forecastResponse] =
      await Promise.all([
        getCurrentWeather(city.lat, city.lon, locale.value),
        getForecast(city.lat, city.lon, locale.value)
      ])

    weather.value = weatherResponse.data
    forecast.value = forecastResponse.data.list

    if (shouldSave && !props.favoriteCity) {
      emit('city-change', {
        blockId: props.blockId,
        city: {
          name: weatherResponse.data.name,
          lat: weatherResponse.data.coord.lat,
          lon: weatherResponse.data.coord.lon
        }
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const city = props.favoriteCity || props.defaultCity

  if (!city) return

  await loadWeather(city, false)
})

watch(
  () => props.defaultCity,
  async city => {
    if (!city || weather.value) return

    await loadWeather(city, false)
  }
)

const toggleFavorite = () => {
  if (!weather.value) return

  const city = {
    name: weather.value.name,
    lat: weather.value.coord.lat,
    lon: weather.value.coord.lon
  }

  if (isFavorite(city.name)) {
    removeFavorite(city.name)
    return
  }

  const result = addFavorite(city)

  if (result === 'limit') {
    showFavoriteLimitModal.value = true
  }
}

const chartLabels = computed(() => {
  return forecast.value
    .slice(0, 8)
    .map(item =>
      item.dt_txt.split(' ')[1].slice(0, 5)
    )
})

const chartTemps = computed(() => {
  return forecast.value
    .slice(0, 8)
    .map(item =>
      Math.round(item.main.temp)
    )
})

const weekData = computed(() => {
  const grouped = {}

  forecast.value.forEach(item => {
    const date = item.dt_txt.split(' ')[0]

    if (!grouped[date]) {
      grouped[date] = []
    }

    grouped[date].push(item.main.temp)
  })

  return Object.entries(grouped)
    .slice(0, 5)
    .map(([date, temps]) => ({
      date,
      avgTemp:
        temps.reduce((a, b) => a + b, 0) /
        temps.length
    }))
})

const weekLabels = computed(() =>
  weekData.value.map(item => item.date)
)

const weekTemps = computed(() =>
  weekData.value.map(item =>
    Math.round(item.avgTemp)
  )
)
</script>

<style scoped>
.weather-block {
  position: relative;
  overflow: hidden;
  min-height: 280px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 22px;
  color: var(--text-main);
  background:
    linear-gradient(145deg, var(--surface-strong), var(--surface)) padding-box,
    linear-gradient(135deg, rgba(255, 158, 199, 0.72), rgba(128, 216, 255, 0.58), rgba(255, 211, 110, 0.62)) border-box;
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px);
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
}

.weather-block::before {
  content: '';
  position: absolute;
  width: 160px;
  height: 160px;
  right: -48px;
  top: -54px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 211, 110, 0.45), rgba(255, 211, 110, 0));
  pointer-events: none;
}

.weather-block::after {
  content: '✦';
  position: absolute;
  right: 28px;
  bottom: 22px;
  color: rgba(255, 158, 199, 0.36);
  font-size: 46px;
  pointer-events: none;
}

.weather-block:hover {
  transform: translateY(-4px);
  box-shadow: 0 26px 60px rgba(128, 112, 166, 0.22);
}

.delete-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(135deg, var(--danger), #ff9fb1);
  box-shadow: 0 12px 22px rgba(255, 114, 144, 0.28);
  font-size: 22px;
  font-weight: 900;
  cursor: pointer;
}

.weather-card {
  position: relative;
  z-index: 2;
  margin-top: 22px;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.weather-header h2 {
  max-width: 220px;
  margin-bottom: 6px;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
}

.weather-header img {
  width: 96px;
  height: 96px;
  padding: 8px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.38);
  filter: drop-shadow(0 14px 18px rgba(91, 74, 111, 0.16));
}

.description {
  color: var(--text-muted);
  font-size: 15px;
  font-weight: 800;
  text-transform: capitalize;
}

.temperature-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: 18px 0 22px;
}

.temperature {
  margin: 0;
  color: var(--text-main);
  font-size: clamp(62px, 12vw, 92px);
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 0.9;
  text-shadow: 0 10px 28px rgba(255, 158, 199, 0.2);
}

.temperature::after {
  content: ' c';
  color: var(--accent-strong);
  font-size: 22px;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.weather-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 86px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface-muted);
}

.info-item span {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 800;
}

.info-item strong {
  color: var(--text-main);
  font-size: 20px;
  font-weight: 900;
}

.view-switcher {
  position: relative;
  z-index: 5;
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-muted);
}

.view-switcher button {
  flex: 1;
  border: none;
  border-radius: 999px;
  padding: 11px 12px;
  color: var(--text-muted);
  background: transparent;
  font-weight: 900;
  cursor: pointer;
}

.view-switcher button.active {
  color: #fff;
  background: linear-gradient(135deg, var(--accent-strong), var(--accent-two));
  box-shadow: 0 12px 24px rgba(128, 216, 255, 0.22);
}

.weather-actions {
  display: flex;
  justify-content: flex-end;
  flex: 0 0 auto;
}

.favorite-btn {
  position: relative;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 42px;
  padding: 10px 16px 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 999px;
  color: #fff;
  background:
    linear-gradient(135deg, var(--accent-strong), var(--accent-three));
  box-shadow:
    0 14px 26px rgba(255, 116, 173, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.38);
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), filter var(--transition);
}

.favorite-btn:hover {
  transform: translateY(-2px);
  box-shadow:
    0 18px 34px rgba(255, 116, 173, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.favorite-btn.active {
  color: var(--text-main);
  background:
    linear-gradient(135deg, #fff4b8, #ffd36e);
  box-shadow:
    0 14px 28px rgba(255, 211, 110, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.favorite-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  font-size: 17px;
  line-height: 1;
}

.empty-state {
  position: relative;
  z-index: 2;
  margin-top: 22px;
  padding: 34px 20px;
  border: 2px dashed rgba(255, 158, 199, 0.45);
  border-radius: 26px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.2);
  text-align: center;
  font-size: 18px;
  font-weight: 900;
}

.empty-state::before {
  content: '🌤️';
  display: block;
  margin-bottom: 10px;
  font-size: 42px;
}

@media (max-width: 480px) {
  .weather-block {
    padding: 18px;
    border-radius: 28px;
  }

  .weather-header h2 {
    max-width: 170px;
    font-size: 24px;
  }

  .weather-header img {
    width: 78px;
    height: 78px;
  }

  .weather-info {
    grid-template-columns: 1fr;
  }
}
</style>
<style scoped>
.info-item:nth-child(1)::before { content: '🌡️'; }
.info-item:nth-child(2)::before { content: '💧'; }
.info-item:nth-child(3)::before { content: '🍃'; }
.info-item:nth-child(4)::before { content: '🧭'; }

.info-item::before {
  align-self: flex-start;
  margin-bottom: 2px;
  font-size: 18px;
}

@media (max-width: 520px) {
  .weather-block {
    min-height: 250px;
    padding: 16px;
    border-radius: 24px;
  }

  .weather-block::before {
    width: 118px;
    height: 118px;
    right: -42px;
    top: -38px;
  }

  .weather-block::after {
    right: 18px;
    bottom: 14px;
    font-size: 34px;
  }

  .delete-btn {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }

  .view-switcher {
    gap: 5px;
    margin-top: 12px;
    padding: 5px;
  }

  .view-switcher button {
    padding: 10px 8px;
    font-size: 14px;
  }

  .weather-card {
    margin-top: 18px;
  }

  .temperature-row {
    gap: 10px;
    margin: 14px 0 16px;
  }

  .weather-actions {
    justify-content: flex-end;
  }

  .favorite-btn {
    max-width: 172px;
    min-height: 40px;
    padding: 9px 11px 9px 9px;
    font-size: 12px;
  }

  .weather-header {
    align-items: flex-start;
    gap: 8px;
  }

  .weather-header h2 {
    max-width: 160px;
    font-size: 23px;
    overflow-wrap: anywhere;
  }

  .description {
    font-size: 13px;
  }

  .weather-header img {
    width: 72px;
    height: 72px;
    padding: 5px;
    border-radius: 22px;
  }

  .temperature {
    font-size: 62px;
  }

  .temperature::after {
    font-size: 16px;
  }

  .weather-info {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .info-item {
    min-height: 78px;
    padding: 11px;
    border-radius: 18px;
  }

  .info-item span {
    font-size: 12px;
  }

  .info-item strong {
    font-size: 17px;
  }

  .empty-state {
    margin-top: 16px;
    padding: 28px 14px;
    border-radius: 22px;
    font-size: 16px;
  }
}

@media (max-width: 380px) {
  .weather-info {
    grid-template-columns: 1fr;
  }
}
</style>
