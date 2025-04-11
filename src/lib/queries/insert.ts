import { db } from "$lib/db/db.server";
import { locationsTable } from "$lib/db/schema";

export async function addLocation(name: string, lat: number, lon : number) {
    await db.insert(locationsTable).values({
        name: name,
        lat: lat,
        lon: lon
    }).execute()
}