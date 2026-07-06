<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  employee: { type: Object, default: null },
  apiError: { type: String, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const SHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG']

const form = ref({ cpf: '', name: '', email: '', shirtSize: '', shoeSize: '' })
const errors = ref({})

const title = computed(() =>
  props.employee ? 'Editar funcionário' : 'Novo funcionário'
)

watch(
  () => props.employee,
  (employee) => {
    if (employee) {
      form.value = {
        cpf: employee.cpf,
        name: employee.name,
        email: employee.email,
        shirtSize: employee.shirt_size,
        shoeSize: employee.shoe_size,
      }
    } else {
      form.value = { cpf: '', name: '', email: '', shirtSize: '', shoeSize: '' }
    }
    errors.value = {}
  },
  { immediate: true }
)

function validate() {
  const e = {}
  if (form.value.cpf.replace(/\D/g, '').length !== 11) e.cpf = 'CPF deve ter 11 dígitos.'
  if (form.value.name.trim().length < 2) e.name = 'Nome é obrigatório.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) e.email = 'Email inválido.'
  if (!SHIRT_SIZES.includes(form.value.shirtSize)) e.shirtSize = 'Selecione um tamanho.'
  const shoe = Number(form.value.shoeSize)
  if (!Number.isInteger(shoe) || shoe < 34 || shoe > 48) e.shoeSize = 'Entre 34 e 48.'
  errors.value = e
  return Object.keys(e).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    cpf: form.value.cpf.replace(/\D/g, ''),
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    shirtSize: form.value.shirtSize,
    shoeSize: Number(form.value.shoeSize),
  })
}
</script>

<template>
  <div class="overlay" @click="emit('cancel')">
    <form class="modal" @click.stop @submit.prevent="handleSubmit">
      <div class="modal-header">
        <div>
          <h2>{{ title }}</h2>
          <p>Preencha os dados do colaborador</p>
        </div>
        <a class="close" @click="emit('cancel')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </a>
      </div>

      <div class="modal-body">
        <p v-if="apiError" class="form-alert span-2">{{ apiError }}</p>
        <label class="field">
          <span>CPF</span>
          <input v-model="form.cpf" type="text" class="mono" placeholder="Somente números" />
          <span v-if="errors.cpf" class="error">{{ errors.cpf }}</span>
        </label>
        <label class="field">
          <span>Nome</span>
          <input v-model="form.name" type="text" placeholder="Nome completo" />
          <span v-if="errors.name" class="error">{{ errors.name }}</span>
        </label>
        <label class="field span-2">
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="nome@grupodass.com" />
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </label>
        <label class="field">
          <span>Tamanho de camiseta</span>
          <select v-model="form.shirtSize">
            <option value="">Selecione</option>
            <option v-for="size in SHIRT_SIZES" :key="size" :value="size">{{ size }}</option>
          </select>
          <span v-if="errors.shirtSize" class="error">{{ errors.shirtSize }}</span>
        </label>
        <label class="field">
          <span>Tamanho de calçado</span>
          <input v-model="form.shoeSize" type="number" min="34" max="48" placeholder="Ex: 40" />
          <span v-if="errors.shoeSize" class="error">{{ errors.shoeSize }}</span>
        </label>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-outline" @click="emit('cancel')">Cancelar</button>
        <button type="submit" class="btn-primary">Salvar</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 26, 38, 0.42);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 56px 20px;
  z-index: 40;
  overflow-y: auto;
}
.modal {
  width: 100%;
  max-width: 520px;
  background: var(--surface);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-modal);
}

.modal-header {
  padding: 18px 22px;
  border-bottom: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--text);
}
.modal-header p {
  margin: 4px 0 0;
  font-size: 12.5px;
  color: var(--muted);
}
.close {
  cursor: pointer;
  color: var(--muted);
  display: flex;
}

.modal-body {
  padding: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field > span:first-child {
  font: 500 12.5px var(--sans);
  color: var(--text-label);
}
.field input,
.field select {
  padding: 10px 12px;
  border: 1px solid var(--border-input);
  border-radius: 8px;
  font: 14px var(--sans);
  color: var(--text);
  background: var(--surface);
}
.field input.mono {
  font: 14px var(--mono);
}
.span-2 {
  grid-column: 1 / 3;
}
.error {
  color: var(--danger);
  font-size: 12px;
}
.form-alert {
  grid-column: 1 / 3;
  margin: 0;
  padding: 10px 14px;
  background: var(--danger-soft);
  border: 1px solid #f6cdd2;
  border-radius: 8px;
  color: var(--danger);
  font: 500 13px var(--sans);
}

.modal-footer {
  padding: 16px 22px;
  background: var(--surface-soft);
  border-top: 1px solid var(--border-soft);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.btn-outline {
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-input);
  padding: 10px 18px;
  border-radius: 8px;
  font: 500 13px var(--sans);
  cursor: pointer;
}
.btn-primary {
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font: 600 13px var(--sans);
  cursor: pointer;
}
.btn-primary:hover {
  background: var(--primary-hover);
}

@media (max-width: 520px) {
  .modal-body {
    grid-template-columns: 1fr;
  }
  .span-2 {
    grid-column: auto;
  }
}
</style>
