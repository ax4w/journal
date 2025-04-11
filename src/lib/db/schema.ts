import { pgTable, real, serial, text, varchar } from 'drizzle-orm/pg-core';

export const locationsTable = pgTable('locations', {
	id: serial('id').primaryKey(),
	name: text().notNull(),
	lat: real().notNull(),
    lon: real().notNull()
});

export type InsertLocation = typeof locationsTable.$inferInsert
export type SelectLocation = typeof locationsTable.$inferSelect