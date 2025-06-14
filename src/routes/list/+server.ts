import { getAllLocations } from '$lib/queries/select';
import { json, type RequestEvent } from '@sveltejs/kit';
import { pubURL, s3 } from '$lib/images';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import type { Location } from '$lib/location';

export async function GET({}: RequestEvent) {
	let locations = await getAllLocations();
	let locationsM: Location[] = [];
	
	await Promise.all(locations.map(async x => {
		const res = await s3.send(
			new ListObjectsV2Command({
				Bucket: process.env.BUCKET!,
				Prefix: `${x.id}/thumb/`
			})
		);

		
		const thumbnails =
			res.Contents?.map((obj) => (
				{
						id: x.id,
						name: x.name,
						lat: x.lat,
						lon: x.lon,
						url: `${pubURL}/${obj.Key}`,
				})) ?? [];

		if (thumbnails.length > 0) {
			const ind: number = Math.floor(Math.random() * thumbnails.length);
			locationsM.push(thumbnails[ind]);
		}
	}));
	return json({ locationsM });
}
