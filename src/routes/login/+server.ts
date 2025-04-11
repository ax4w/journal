import { createCookie, isCorrectPW, validateCookie } from "$lib/session";
import { error, json, type RequestEvent } from "@sveltejs/kit";

export async function POST({ request, cookies }: RequestEvent) {
    let body = await request.json()
    let pw = body.password
    if (!isCorrectPW(pw)) {
        return json({success: false})
    }
    let token = createCookie()
    cookies.set('auth', token, {
        path: '/',
        httpOnly: true,
        secure: true
    });
    return json({success: true})
};