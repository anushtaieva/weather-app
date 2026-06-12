//імпортуємо бібліотеку Vue Router та створюємо об'єкт, який буде зберігати всі маршрути апки (createRouter), а також createWebHistory для "красивих" посилань 
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import FavoritesView from '../views/FavoritesView.vue'

//створюємо екземпляр роутера
const router = createRouter({
  // History API браузера
  history: createWebHistory(),
  // список маршрутів
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/favorites',
      component: FavoritesView
    }
  ]
})

//експортуємо роутер
export default router