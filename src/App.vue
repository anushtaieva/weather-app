<!-- головний контейнер всієї апки -->
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

//для роботи з локалізацією
const { locale } = useI18n()

//намагаємося прочитати тему з локалсторадж
const theme = ref(
  localStorage.getItem('theme') || 'day'
)
//функція, яка змінює тему
const toggleTheme = () => {
  theme.value = theme.value === 'day'
    ? 'night'
    : 'day'

  localStorage.setItem('theme', theme.value)

  document.body.className = theme.value
}

//функція, яка змінює локалізацію
const changeLocale = value => {
  locale.value = value
  localStorage.setItem('locale', value)
}


onMounted(() => {
  document.body.className = theme.value
})
</script>