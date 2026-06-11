<template>
  <div class="page">
    <div class="toolbar">
    <h1 class="title">
      {{ $t('dashboard') }}
    </h1>

      <button
        class="add-btn"
        @click="addBlock"
        :disabled="blocks.length >= 5"
      >
        +
      </button>
    </div>

    <div
      ref="blocksContainer"
      class="blocks"
    >
      <WeatherBlock
        v-for="block in blocks"
        :key="block.id"
        :block-id="block.id"
        :default-city="block.defaultCity"
        :show-delete="blocks.length > 1"
        @city-change="updateBlockCity"
        @remove="openRemoveModal"
      />
    </div>

    <div
      v-if="showModal"
      class="modal-overlay"
    >
      <div class="modal">
        <p>{{ $t('deleteWeatherBlock') }}</p>

        <div class="actions">
          <button @click="confirmRemove">
            {{ $t('delete') }}
          </button>

          <button @click="closeModal">
            {{ $t('cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import WeatherBlock from '../components/WeatherBlock.vue'

import {
  getUserLocationByIp,
  searchCities
} from '../api/weatherApi'

import {
  ref,
  onMounted,
  nextTick
} from 'vue'

const STORAGE_KEY = 'weatherBlocks'

const savedBlocks =
  JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

const blocks = ref(
  savedBlocks.length
    ? savedBlocks.map(city => ({
        id: crypto.randomUUID(),
        defaultCity: city
      }))
    : [
        {
          id: crypto.randomUUID(),
          defaultCity: null
        }
      ]
)

const showModal = ref(false)
const blockToDelete = ref(null)
const blocksContainer = ref(null)

const addBlock = async () => {
  if (blocks.value.length >= 5) return

  blocks.value.push({
    id: crypto.randomUUID(),
    defaultCity: null
  })

  await nextTick()

  const lastBlock =
    blocksContainer.value?.lastElementChild

  const searchField =
    lastBlock?.querySelector('.autocomplete')

  if (!searchField) return

  const rect = searchField.getBoundingClientRect()
  const isSearchFieldVisible =
    rect.top >= 0 &&
    rect.bottom <= window.innerHeight

  if (isSearchFieldVisible) return

  searchField.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const openRemoveModal = (id) => {
  if (blocks.value.length === 1) {
    return
  }

  blockToDelete.value = id
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  blockToDelete.value = null
}

const confirmRemove = () => {
  blocks.value = blocks.value.filter(
    block => block.id !== blockToDelete.value
  )

  saveBlocks()
  closeModal()
}

onMounted(async () => {
  try {
    const locationResponse = await getUserLocationByIp()

    const cityName = locationResponse.data.city

    if (!cityName) return

    const cityResponse = await searchCities(cityName)

    const city = cityResponse.data[0]

    if (!city) return

    blocks.value[0].defaultCity = {
      name: city.name,
      lat: city.lat,
      lon: city.lon
    }
  } catch (error) {
    console.error(error)
  }
})


const saveBlocks = () => {
  const cities = blocks.value
    .filter(block => block.defaultCity)
    .map(block => block.defaultCity)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(cities)
  )
}

const updateBlockCity = ({ blockId, city }) => {
  const block = blocks.value.find(
    item => item.id === blockId
  )

  if (!block) return

  block.defaultCity = {
    name: city.name,
    lat: city.lat,
    lon: city.lon
  }

  saveBlocks()
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px);
}

.title {
  color: var(--text-main);
  font-size: clamp(30px, 5vw, 56px);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 0.95;
}

.title::after {
  content: '  ☀️🌦️';
  font-size: clamp(24px, 4vw, 42px);
  letter-spacing: -0.15em;
}

.add-btn {
  width: 58px;
  height: 58px;
  flex: 0 0 auto;
  border: none;
  border-radius: 22px;
  color: #fff;
  background: linear-gradient(135deg, var(--accent-strong), var(--accent-three));
  box-shadow: 0 18px 34px rgba(255, 116, 173, 0.28);
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
  cursor: pointer;
}

.add-btn:disabled {
  opacity: 0.46;
  filter: grayscale(0.25);
}

.blocks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
  gap: 24px;
}

@media (max-width: 560px) {
  .toolbar {
    padding: 22px;
    border-radius: 28px;
  }

  .add-btn {
    width: 52px;
    height: 52px;
  }
}
</style>
<style scoped>
@media (max-width: 520px) {
  .page {
    gap: 16px;
  }

  .toolbar {
    gap: 12px;
    padding: 18px 16px;
    border-radius: 24px;
  }

  .title {
    font-size: 28px;
    line-height: 1.04;
  }

  .title::after {
    display: block;
    margin-top: 5px;
    font-size: 22px;
    letter-spacing: -0.08em;
  }

  .add-btn {
    width: 48px;
    height: 48px;
    border-radius: 18px;
    font-size: 30px;
  }

  .blocks {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
