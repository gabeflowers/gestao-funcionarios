<script setup>
defineProps({
  employees: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'delete', 'create'])

function formatCpf(cpf) {
  const digits = String(cpf).replace(/\D/g, '')
  if (digits.length !== 11) return cpf
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
</script>

<template>
  <table v-if="employees.length" class="table">
    <thead>
      <tr>
        <th class="col-first">CPF</th>
        <th>Nome</th>
        <th>Email</th>
        <th>Camiseta</th>
        <th>Calçado</th>
        <th class="col-actions">Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="emp in employees" :key="emp.id">
        <td class="col-first cpf">{{ formatCpf(emp.cpf) }}</td>
        <td>{{ emp.name }}</td>
        <td class="email">{{ emp.email }}</td>
        <td><span class="size-badge">{{ emp.shirt_size }}</span></td>
        <td>{{ emp.shoe_size }}</td>
        <td class="col-actions">
          <a class="link-edit" @click="emit('edit', emp)">Editar</a>
          <a class="link-delete" @click="emit('delete', emp.id)">Excluir</a>
        </td>
      </tr>
    </tbody>
  </table>
  <div v-else class="empty">
    <div class="empty-icon">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2450d8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" /></svg>
    </div>
    <h3>Nenhum funcionário cadastrado</h3>
    <p>Comece adicionando o primeiro colaborador ao sistema.</p>
    <button class="btn-primary" @click="emit('create')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
      Novo funcionário
    </button>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  font: 14px var(--sans);
}
.table th {
  text-align: left;
  padding: 11px 12px;
  font: 600 10.5px var(--mono);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--muted);
  background: var(--surface-head);
}
.table td {
  padding: 13px 12px;
  color: var(--text);
}
.table tbody tr {
  border-top: 1px solid var(--border-soft);
}
.table tbody tr:nth-child(even) {
  background: var(--surface-soft);
}
.col-first {
  padding-left: 24px !important;
}
.col-actions {
  padding-right: 24px !important;
  text-align: right;
  white-space: nowrap;
}
.cpf {
  font: 14px var(--mono);
}
.email {
  color: var(--text-secondary);
}
.size-badge {
  font: 500 12px var(--sans);
  background: var(--border-soft);
  color: var(--text-label);
  padding: 2px 9px;
  border-radius: 6px;
}
.link-edit,
.link-delete {
  font: 500 13px var(--sans);
  text-decoration: none;
  cursor: pointer;
}
.link-edit {
  color: var(--primary);
  margin-right: 14px;
}
.link-delete {
  color: var(--danger);
}

.empty {
  padding: 56px 24px;
  text-align: center;
}
.empty-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}
.empty h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}
.empty p {
  margin: 6px auto 18px;
  font-size: 13px;
  color: var(--muted);
  max-width: 280px;
}
.btn-primary {
  display: inline-flex;
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
</style>
