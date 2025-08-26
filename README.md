# journal
Interactive travel / photo map, because photo books are boring :^)

Successor to [photo-map](https://github.com/ax4w/photo-map)

<img width="1436" height="978" alt="image" src="https://github.com/user-attachments/assets/c1678d3f-31a0-411b-8b42-fb6eab0c96a0" />



## Techstack
Journal is complelty written in Typescript and Svelte.

## Deployment
```
DSN=<pg connection string>
ACCESS_KEY_ID=<bucket access key>
SECRET_ACCESS_KEY=<bucket access secret>
BUCKET=<bucket name>
ENDPOINT=https://url-to-your-bucket
PASSWORD=<admin password>
```
All these environment variables need to be set. I can recommend to use [neon](https://neon.tech) for the database and [Cloudflare R2](https://www.cloudflare.com/de-de/developer-platform/products/r2/) for the buckets. 

Currently the API Key for maptiler is set to my own, but restricted to my own domain (it wont work for you). You either need to use your own key or choose another provider

### Changing Database
If you don't want to use neon for your database you can just change the drizzle configuration in `src/lib/db/db.server.ts` 

### The first run
You need to migriate with [drizzle](https://orm.drizzle.team/) first depending on your database. After the migration everything should simply start up :)

Initially no markers will be present. In order to add markers simply click on the button in the top left and enter the `PASSWORD`. A search bar will appear were you can enter the location name. 
Additional markers will appear (same color) on all locations with that name, click on the right one and select it. 

To upload pictures, just click on the marker and select the image(s) to upload and press upload (you need to be signed-in for that aswell). 

Journal will automatically generate the thumbnails while uploading the images

## Security notice
Journal does not use JWT or any session management to keep it simple. Best practice is to log-out (by pressing the button on the top left again) to clear the auth cookie
