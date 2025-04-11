// https://pub-e8e3bcc1c0c2403895524ba46dc988c7.r2.dev

import { S3Client } from "@aws-sdk/client-s3";

export interface Thumbnail {
    key: string;
    full: string;
    url: string;
}

export const pubURL = "https://pub-e8e3bcc1c0c2403895524ba46dc988c7.r2.dev"

export const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.ENDPOINT,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
});
