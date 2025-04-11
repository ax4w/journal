import { json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, cookies }: RequestEvent) {
    cookies.delete('auth', { path : '/' })
    return json({success: true})
};