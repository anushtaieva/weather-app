<template>
  <div class="container">
    <header class="header">
      <RouterLink to="/">
        {{ $t('weather') }}
      </RouterLink>

      <RouterLink to="/favorites">
        {{ $t('favorites') }}
      </RouterLink>
      <select
        :value="locale"
        @change="changeLocale($event.target.value)"
      >
        <option value="uk">UK</option>
        <option value="en">EN</option>
      </select>

      <button
        class="theme-btn"
        @click="toggleTheme"
      >
        {{ theme === 'day' ? '🌙 Night' : '☀️ Day' }}
      </button>

    </header>

    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const theme = ref(
  localStorage.getItem('theme') || 'day'
)

const changeLocale = value => {
  locale.value = value
  localStorage.setItem('locale', value)
}

const toggleTheme = () => {
  theme.value = theme.value === 'day'
    ? 'night'
    : 'day'

  localStorage.setItem('theme', theme.value)

  document.body.className = theme.value
}

onMounted(() => {
  document.body.className = theme.value
})
</script>

<style>
/* Все основные стили вынесены в src/style/weather-app-cute-theme.scss */
</style>