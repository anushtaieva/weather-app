<template>
  <div class="loader">
    //блок, який за допомогою css перетворюється на коло, що крутиться
    <div class="spinner"></div>
    <span>Loading...</span>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 26px;
  color: var(--text-muted);
  font-weight: 900;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 4px solid rgba(255, 158, 199, 0.28);
  border-top-color: var(--accent-strong);
  border-right-color: var(--accent-two);
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>