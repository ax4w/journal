import { allCooridantesForSearch } from "$lib/location";
import { getAllLocations } from "$lib/queries/select";
import { error, json, type RequestEvent } from "@sveltejs/kit";

export async function GET({  }: RequestEvent) {
	let locations = await getAllLocations()
	return json({locations})
};