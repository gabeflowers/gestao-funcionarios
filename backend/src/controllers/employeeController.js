import * as service from '../services/employeeService.js';

export async function list(req, res, next) {
  try {
    const employees = await service.listEmployees(req.query);
    res.json(employees);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const employee = await service.getEmployee(Number(req.params.id));
    res.json(employee);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const created = await service.createEmployee(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await service.updateEmployee(Number(req.params.id), req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await service.deleteEmployee(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}