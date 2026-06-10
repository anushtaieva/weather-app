<template>
  <div>
    <div class="toolbar">
      <button
        @click="addBlock"
        :disabled="blocks.length >= 5"
      >
        +
      </button>
    </div>

    <div class="blocks">
      <WeatherBlock
        v-for="block in blocks"
        :key="block.id"
        :block-id="block.id"
        @remove="openRemoveModal"
      />
    </div>

    <div
      v-if="showModal"
      class="modal-overlay"
    >
      <div class="modal">
        <p>Удалить блок?</p>

        <div class="actions">
          <button @click="confirmRemove">
            Да
          </button>

          <button @click="closeModal">
            Нет
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WeatherBlock from '../components/WeatherBlock.vue'

const blocks = ref([
  {
    id: crypto.randomUUID()
  }
])

const showModal = ref(false)
const blockToDelete = ref(null)

const addBlock = () => {
  if (blocks.value.length >= 5) return

  blocks.value.push({
    id: crypto.randomUUID()
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

  closeModal()
}
</script>

<style scoped>
.weather-block {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  min-height: 100px;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 32px;
  height: 32px;

  background: red !important;
  color: white !important;

  border: 2px solid black !important;
  border-radius: 50%;

  cursor: pointer;
  z-index: 9999;
}
</style>