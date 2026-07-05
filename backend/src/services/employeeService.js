import * as repository from '../repositories/employeeRepository.js';
import { isValidCpf } from '../utils/validateCpf.js';

const SHIRT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
  }
}

function validate(data) {
  const cpf = String(data.cpf ?? '').replace(/\D/g, '');
  const name = String(data.name ?? '').trim();
  const email = String(data.email ?? '').trim().toLowerCase();
  const shirtSize = data.shirtSize;
  const shoeSize = Number(data.shoeSize);

  if (!isValidCpf(cpf)) {
    throw new ValidationError('CPF inválido.');
  }
  if (name.length < 2) {
    throw new ValidationError('Nome é obrigatório.');
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new ValidationError('Email inválido.');
  }
  if (!SHIRT_SIZES.includes(shirtSize)) {
    throw new ValidationError('Tamanho de camiseta inválido.');
  }
  if (!Number.isInteger(shoeSize) || shoeSize < 34 || shoeSize > 48) {
    throw new ValidationError('Tamanho de calçado deve ser entre 34 e 48.');
  }

  return { cpf, name, email, shirtSize, shoeSize };
}

export async function listEmployees(filters = {}) {
  const hasFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== ''
  );
  return hasFilters ? repository.search(filters) : repository.findAll();
}

export async function getEmployee(id) {
  const employee = await repository.findById(id);
  if (!employee) {
    throw new NotFoundError('Funcionário não encontrado.');
  }
  return employee;
}

export async function createEmployee(data) {
  const clean = validate(data);
  try {
    return await repository.create(clean);
  } catch (err) {
    if (err.code === '23505') {
      throw new ConflictError('CPF ou email já cadastrado.');
    }
    throw err;
  }
}

export async function updateEmployee(id, data) {
  await getEmployee(id);
  const clean = validate(data);
  try {
    return await repository.update(id, clean);
  } catch (err) {
    if (err.code === '23505') {
      throw new ConflictError('CPF ou email já cadastrado.');
    }
    throw err;
  }
}

export async function deleteEmployee(id) {
  const deleted = await repository.remove(id);
  if (!deleted) {
    throw new NotFoundError('Funcionário não encontrado.');
  }
}