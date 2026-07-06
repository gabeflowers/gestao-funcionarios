<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])
const SHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG']

const filters = ref({ cpf: '', name: '', email: '', shirtSize: '', shoeSize: '' })

function handleSearch() {
  emit('search', { ...filters.value })
}

function handleClear() {
  filters.value = { cpf: '', name: '', email: '', shirtSize: '', shoeSize: '' }
  emit('search', {})
}
</script>

<template>
  <div class="search">
    <input v-model="filters.cpf" class="f-cpf" placeholder="CPF" />
    <input v-model="filters.name" class="f-name" placeholder="Nome" />
    <input v-model="filters.email" class="f-email" placeholder="Email" />
    <select v-model="filters.shirtSize" :class="{ placeholder: !filters.shirtSize }">
      <option value="">Camiseta</option>
      <option v-for="size in SHIRT_SIZES" :key="size" :value="size">{{ size }}</option>
    </select>
    <input v-model="filters.shoeSize" class="f-shoe" type="number" placeholder="Calçado" />
    <button class="btn-primary" @click="handleSearch">Buscar</button>
    <button class="btn-outline" @click="handleClear">Limpar</button>
  </div>
</template>

<style scoped>
.search {
  padding: 16px 24px;
  background: var(--surface-soft);
  border-bottom: 1px solid var(--border-soft);
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.search input,
.search select {
  padding: 9px 12px;
  border: 1px solid var(--border-input);
  border-radius: 8px;
  font: 14px var(--sans);
  color: var(--text);
  background: var(--surface);
}
.f-cpf {
  flex: 1;
  min-width: 120px;
}
.f-name {
  flex: 1.2;
  min-width: 130px;
}
.f-email {
  flex: 1.4;
  min-width: 150px;
}
.f-shoe {
  width: 90px;
}
select.placeholder {
  color: var(--muted);
}
.btn-primary {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 9px 16px;
  border-radius: 8px;
  font: 600 13px var(--sans);
  cursor: pointer;
}
.btn-primary:hover {
  background: var(--primary-hover);
}
.btn-outline {
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-input);
  padding: 9px 14px;
  border-radius: 8px;
  font: 500 13px var(--sans);
  cursor: pointer;
}

@media (max-width: 640px) {
  .search {
    padding: 14px 16px;
  }
  .f-cpf,
  .f-name,
  .f-email {
    flex: 1 1 100%;
  }
  .search select,
  .f-shoe {
    flex: 1;
    width: auto;
    min-width: 0;
  }
  .btn-primary,
  .btn-outline {
    flex: 1;
  }
}
</style>
