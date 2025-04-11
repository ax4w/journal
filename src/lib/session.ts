import { sha256 } from "js-sha256";

export function validateCookie(session: string) {
    return sha256(process.env.PASSWORD!) == session
}

export function isCorrectPW(pw: string) {
    return process.env.PASSWORD! == pw
}

export function createCookie() {
    return sha256(process.env.PASSWORD!)
}