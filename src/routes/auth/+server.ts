import { validateCookie } from "$lib/session";
import { error, json, type RequestEvent } from "@sveltejs/kit";

export async function GET({ cookies }: RequestEvent) {
    let auth = cookies.get("auth")
    if (!auth) {
        return json({success: false})
    }
    return json({success: validateCookie(auth)})
};