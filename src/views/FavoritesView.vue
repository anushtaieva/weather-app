<!-- шаблон для обраного -->
<template>
  <div>
    <h1>{{ $t('favorites') }}</h1>

    <div class="favorites-grid">
      <WeatherBlock
        v-for="city in favorites"
        :key="city.name"
        block-id="favorite"
        :favorite-city="city"
        :show-delete="false"
      />
    </div>
  </div>
</template>

<script setup>
import WeatherBlock from '../components/WeatherBlock.vue'

import {
  useFavorites
} from '../composables/useFavorites'

//отримуємо список обраних
const { favorites } =
  useFavorites()
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  color: var(--text-main);
  background: var(--surface);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px);
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 900;
  letter-spacing: -0.04em;
}

h1::after {
  content: '  ⭐💖';
  font-size: clamp(24px, 4vw, 40px);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
  gap: 24px;
}
</style>
<style scoped>
@media (max-width: 520px) {
  div {
    gap: 16px;
  }

  h1 {
    padding: 18px 16px;
    border-radius: 24px;
    font-size: 30px;
  }

  h1::after {
    display: block;
    margin-top: 5px;
    font-size: 24px;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
