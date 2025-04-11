import { error, json } from "@sveltejs/kit"
import type { RequestEvent } from "./$types"
import { addLocation } from "$lib/queries/insert"
import { validateCookie } from "$lib/session"

export async function POST({ request, cookies }: RequestEvent) {
    let auth = cookies.get("auth")
    if (!auth || !validateCookie(auth)) {
        throw error(400, "no auth cookie set")
    }
    let body = await request.json()
    let name = body.name
    let lat = body.lat
    let lon = body.lon
    if (!name || !lat || !lon) {
        error(400, "name, lat and lon need to be provided")
    }
    addLocation(name, lat, lon)
    return json({success: true})
};