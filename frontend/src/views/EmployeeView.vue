<script setup>
import { ref, onMounted } from 'vue'
import * as api from '../services/employeeService.js'
import EmployeeTable from '../components/EmployeeTable.vue'
import EmployeeForm from '../components/EmployeeForm.vue'
import EmployeeSearch from '../components/EmployeeSearch.vue'

const employees = ref([])
const loading = ref(false)
const feedback = ref(null)
const showForm = ref(false)
const selected = ref(null)
const formError = ref(null)
const deleteTarget = ref(null)

async function loadEmployees(filters = {}) {
  loading.value = true
  try {
    employees.value = await api.getEmployees(filters)
  } catch (err) {
    showFeedback(err.message, 'error')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  selected.value = null
  formError.value = null
  showForm.value = true
}

function openEdit(employee) {
  selected.value = employee
  formError.value = null
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  selected.value = null
  formError.value = null
}

async function handleSubmit(payload) {
  formError.value = null
  try {
    if (selected.value) {
      await api.updateEmployee(selected.value.id, payload)
      showFeedback('Funcionário atualizado com sucesso.')
    } else {
      await api.createEmployee(payload)
      showFeedback('Funcionário cadastrado com sucesso.')
    }
    closeForm()
    await loadEmployees()
  } catch (err) {
    formError.value = err.message
  }
}

function handleDelete(id) {
  deleteTarget.value = employees.value.find((emp) => emp.id === id) || null
}

function closeDelete() {
  deleteTarget.value = null
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  try {
    await api.deleteEmployee(deleteTarget.value.id)
    showFeedback('Funcionário excluído com sucesso.')
    await loadEmployees()
  } catch (err) {
    showFeedback(err.message, 'error')
  } finally {
    closeDelete()
  }
}

function handleSearch(filters) {
  loadEmployees(filters)
}

function showFeedback(message, type = 'success') {
  feedback.value = { message, type }
  setTimeout(() => (feedback.value = null), 3000)
}

onMounted(() => loadEmployees())
</script>

<template>
  <section class="view">
    <header class="brand">
      <div class="brand-mark">GD</div>
      <div class="brand-text">
        <div class="brand-name">Grupo Dass</div>
        <div class="brand-sub">Cadastro de Funcionários</div>
      </div>
    </header>

    <p v-if="feedback" :class="['feedback', feedback.type]">
      {{ feedback.message }}
    </p>

    <div class="card">
      <div class="card-header">
        <div>
          <div class="title-row">
            <h1>Funcionários</h1>
            <span class="count-badge">{{ employees.length }} cadastrados</span>
          </div>
          <p class="subtitle">Gerencie os dados da equipe</p>
        </div>
        <button class="btn-primary" @click="openCreate">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Novo funcionário
        </button>
      </div>

      <EmployeeSearch @search="handleSearch" />

      <p v-if="loading" class="loading">Carregando...</p>
      <EmployeeTable
        v-else
        :employees="employees"
        @edit="openEdit"
        @delete="handleDelete"
        @create="openCreate"
      />

      <div class="card-footer">
        <span>Mostrando {{ employees.length }} de {{ employees.length }} funcionários</span>
        <span class="footer-tag">Grupo Dass · RH</span>
      </div>
    </div>

    <EmployeeForm
      v-if="showForm"
      :employee="selected"
      :api-error="formError"
      @submit="handleSubmit"
      @cancel="closeForm"
    />

    <div v-if="deleteTarget" class="overlay" @click="closeDelete">
      <div class="dialog" @click.stop>
        <div class="dialog-body">
          <div class="dialog-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1394b" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
          </div>
          <div>
            <h3>Excluir funcionário?</h3>
            <p>
              Tem certeza que deseja excluir <b>{{ deleteTarget.name }}</b>?
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="btn-outline" @click="closeDelete">Cancelar</button>
          <button class="btn-danger" @click="confirmDelete">Excluir</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.view {
  min-height: 100vh;
  max-width: 1120px;
  margin: 0 auto;
  padding: 28px 24px 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 13px;
}
.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  font: 700 15px var(--sans);
  color: #fff;
  letter-spacing: 0.02em;
}
.brand-text {
  line-height: 1.15;
}
.brand-name {
  font: 700 16px var(--sans);
  color: var(--text);
  letter-spacing: -0.01em;
}
.brand-sub {
  font: 500 12px var(--sans);
  color: var(--muted);
}

.feedback {
  margin: 0;
  padding: 11px 16px;
  border-radius: 9px;
  font: 500 13.5px var(--sans);
}
.feedback.success {
  background: #e6f4ea;
  color: #1a7f37;
  border: 1px solid #cbe8d3;
}
.feedback.error {
  background: var(--danger-soft);
  color: var(--danger);
  border: 1px solid #f6cdd2;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.card-header {
  padding: 22px 24px 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--border-soft);
}
.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.title-row h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}
.count-badge {
  font: 500 12px var(--sans);
  background: var(--primary-soft);
  color: var(--primary);
  padding: 3px 9px;
  border-radius: 20px;
}
.subtitle {
  margin: 5px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--primary);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 9px;
  font: 600 13px var(--sans);
  cursor: pointer;
}
.btn-primary:hover {
  background: var(--primary-hover);
}

.loading {
  margin: 0;
  padding: 24px;
  font-size: 13px;
  color: var(--muted);
}

.card-footer {
  padding: 13px 24px;
  background: var(--surface-soft);
  border-top: 1px solid var(--border-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font: 500 12.5px var(--sans);
  color: var(--muted);
}
.footer-tag {
  font: 400 11.5px var(--mono);
  color: var(--muted-light);
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 26, 38, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 40;
}
.dialog {
  width: 100%;
  max-width: 420px;
  background: var(--surface);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-card);
  padding: 24px;
  box-shadow: var(--shadow-modal);
}
.dialog-body {
  display: flex;
  gap: 14px;
}
.dialog-icon {
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 11px;
  background: var(--danger-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.dialog p {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
}
.dialog p b {
  color: var(--text);
}
.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
.btn-outline {
  background: var(--surface);
  color: var(--text-secondary);
  border: 1px solid var(--border-input);
  padding: 9px 16px;
  border-radius: 8px;
  font: 500 13px var(--sans);
  cursor: pointer;
}
.btn-danger {
  background: var(--danger);
  color: #fff;
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font: 600 13px var(--sans);
  cursor: pointer;
}

@media (max-width: 640px) {
  .view {
    padding: 20px 14px 32px;
  }
  .card-header {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
