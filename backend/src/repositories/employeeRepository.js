import { pool } from '../db/pool.js';

export async function findAll() {
  const { rows } = await pool.query(
    'SELECT * FROM employees ORDER BY created_at DESC'
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM employees WHERE id = $1',
    [id]
  );
  return rows[0] ?? null;
}

export async function search(filters) {
  const conditions = [];
  const values = [];

  if (filters.cpf) {
    values.push(`%${filters.cpf.replace(/\D/g, '')}%`);
    conditions.push(`cpf ILIKE $${values.length}`);
  }
  if (filters.name) {
    values.push(`%${filters.name}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }
  if (filters.email) {
    values.push(`%${filters.email}%`);
    conditions.push(`email ILIKE $${values.length}`);
  }
  if (filters.shirtSize) {
    values.push(filters.shirtSize);
    conditions.push(`shirt_size = $${values.length}`);
  }
  if (filters.shoeSize) {
    values.push(Number(filters.shoeSize));
    conditions.push(`shoe_size = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const { rows } = await pool.query(
    `SELECT * FROM employees ${whereClause} ORDER BY created_at DESC`,
    values
  );
  return rows;
}

export async function create(employee) {
  const { cpf, name, email, shirtSize, shoeSize } = employee;
  const { rows } = await pool.query(
    `INSERT INTO employees (cpf, name, email, shirt_size, shoe_size)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [cpf, name, email, shirtSize, shoeSize]
  );
  return rows[0];
}

export async function update(id, employee) {
  const { cpf, name, email, shirtSize, shoeSize } = employee;
  const { rows } = await pool.query(
    `UPDATE employees
     SET cpf = $1, name = $2, email = $3, shirt_size = $4, shoe_size = $5
     WHERE id = $6
     RETURNING *`,
    [cpf, name, email, shirtSize, shoeSize, id]
  );
  return rows[0] ?? null;
}

export async function remove(id) {
  const result = await pool.query(
    'DELETE FROM employees WHERE id = $1',
    [id]
  );
  return result.rowCount > 0;
}