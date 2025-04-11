import { allCooridantesForSearch } from "$lib/location";
import { validateCookie } from "$lib/session";
import { error, json, type RequestEvent } from "@sveltejs/kit";

export async function GET({ params, cookies }: RequestEvent) {
	let auth = cookies.get("auth")
	if (!auth || !validateCookie(auth)) {
		throw error(400, "no auth cookie set")
	}
	let search = params.input
	if (search == null || search?.length == 0) {
		error(400, "no search input was provided")
	}
	let locations = await allCooridantesForSearch(search)
	return json({ locations })
};