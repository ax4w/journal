import { s3 } from '$lib/images';
import { validateCookie } from '$lib/session';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { error, json, type RequestEvent } from '@sveltejs/kit';

export async function DELETE({ params, cookies }: RequestEvent) {
	let auth = cookies.get('auth');
	if (!auth || !validateCookie(auth)) {
		throw error(400, 'no auth cookie set');
	}
	let id = params.id;
	if (!id) {
		throw error(400, 'no id provided');
	}
	let file = params.file;
	if (!id) {
		throw error(400, 'no id provided');
	}

	const fullKey = `${id}/img/${file}`;
	const thumbKey = `${id}/thumb/${file}`;
	try {
		await s3.send(
			new DeleteObjectCommand({
				Bucket: process.env.BUCKET!,
				Key: fullKey
			})
		);
		await s3.send(
			new DeleteObjectCommand({
				Bucket: process.env.BUCKET!,
				Key: thumbKey
			})
		);
		return json({ message: 'upload successful' });
	} catch (err: any) {
		throw error(500, 'file was not uploaded');
	}
}
