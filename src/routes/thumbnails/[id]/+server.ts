import { pubURL, s3 } from "$lib/images";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { error, json, type RequestEvent } from "@sveltejs/kit";

function fullResURL(obj: string) {
    let args = obj.split("/")
    if(args.length != 3) return
    args[1] = "img"
    return args.join("/")
}

export async function GET({ params }: RequestEvent) {
    const id = params.id;
    if (!id) {
        throw error(400, "no id provided")
    }
    try {
        const res = await s3.send(new ListObjectsV2Command({
            Bucket: process.env.BUCKET!,
            Prefix: `${id}/thumb/`
        }));
        
        const thumbnails = res.Contents?.map(obj => ({
            key: obj.Key,
            full: `${pubURL}/${fullResURL(obj.Key as string)}`,
            url: `${pubURL}/${obj.Key}`
        })) ?? [];

        return json({ thumbnails });
    } catch (err: any) {
        console.log(err)
        throw error(500, "error while fetching numbnails")
    }
}