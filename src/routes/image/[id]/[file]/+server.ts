import { error } from "@sveltejs/kit";
import type { RequestEvent } from "./$types";
import { Readable } from 'stream';
import { s3 } from "$lib/images";
import { GetObjectCommand } from '@aws-sdk/client-s3';

async function streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
  }

export async function GET({ params }: RequestEvent) {
    const { id, file } = params;
    if (!id || !file) {
        throw error(400, "id and file need to be set")
    }
    const key = `${id}/img/${file}`;
    try {
        const res = await s3.send(new GetObjectCommand({
          Bucket: process.env.BUCKET!,
          Key: key
        }));

        const stream = res.Body as Readable;
        const body = await streamToBuffer(stream);
    
        return new Response(body, {
          headers: {
            'Content-Type': res.ContentType || 'application/octet-stream'
          }
        });
      } catch {
        throw error(404, 'image not found');
      }
}