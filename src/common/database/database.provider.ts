import { db } from '../../prisma/db';

export const DATABASE = Symbol('DATABASE');

export type Database = typeof db;

export const databaseProvider = {
  provide: DATABASE,
  useValue: db,
};