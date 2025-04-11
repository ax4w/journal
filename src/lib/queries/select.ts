import { db } from "$lib/db/db.server";
import { locationsTable } from "$lib/db/schema";
import { eq } from "drizzle-orm";

export async function getAllLocations() {
    return db.select().from(locationsTable)
}

export async function isValidLocation(id: number) {
    return db.select().from(locationsTable).where(eq(locationsTable.id, id))
}