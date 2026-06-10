<template>
  <div class="container">
    <header class="header">
      <RouterLink to="/">
        Weather
      </RouterLink>

      <RouterLink to="/favorites">
        Favorites
      </RouterLink>
    </header>

    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
}

.container {
  max-width: 1200px;
  min-width: 360px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.header a {
  text-decoration: none;
  color: black;
  font-weight: 600;
}
</style>