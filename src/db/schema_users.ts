import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('name', {length: 500}).notNull(),
  first: varchar('first', {length: 500}).notNull(),
  last: varchar('last', {length: 500}).notNull(),
  password: varchar('password', {length: 500}).notNull(),
  role: varchar('role', {length: 500}).notNull(),
});