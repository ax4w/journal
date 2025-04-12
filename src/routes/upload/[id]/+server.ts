import { s3 } from "$lib/images";
import { isValidLocation } from "$lib/queries/select";
import { validateCookie } from "$lib/session";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { error, json, type RequestEvent } from "@sveltejs/kit";
import sharp from "sharp";


export async function POST({ params, request, cookies }: RequestEvent) {
    let auth = cookies.get("auth")
    if (!auth || !validateCookie(auth)) {
        throw error(400, "no auth cookie set")
    }
    let id = params.id
    if (!id) {
        throw error(400, "no id provided");
    }
    let resp = await isValidLocation(parseInt(id))
    if (resp.length == 0) {
        throw error(400, "invalid location");
    }
    let formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
        throw error(400, "no file provided");
    }
    const originalName = file.name;
    const fullKey = `${id}/img/${originalName}`;
    const thumbKey = `${id}/thumb/${originalName}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const compressedBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 300, height: 300 })
        .avif({ quality: 60 })
        .toBuffer();

    try {
        console.log("trying to upload to id", id)
        await s3.send(new PutObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: fullKey,
            Body: buffer,
            ContentType: file.type
        }));

        await s3.send(new PutObjectCommand({
            Bucket: process.env.BUCKET!,
            Key: thumbKey,
            Body: compressedBuffer,
            ContentType: 'image/jpeg'
        }));

        return json({ message: 'upload successful', fullKey, thumbKey });
    } catch (err: any) {
        throw error(500, "file was not uploaded")
    }
}