import { deleteCookie, getCookies, setCookie } from "@std/http/cookie";

export const SESSION_COOKIE = "admin_session";

/** Read the session id from the request cookies (empty string if absent). */
export function readSessionCookie(headers: Headers): string {
  return getCookies(headers)[SESSION_COOKIE] ?? "";
}

/** Attach the session cookie to a response's headers. */
export function attachSessionCookie(headers: Headers, id: string): void {
  setCookie(headers, {
    name: SESSION_COOKIE,
    value: id,
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Clear the session cookie on a response's headers. */
export function clearSessionCookie(headers: Headers): void {
  deleteCookie(headers, SESSION_COOKIE, { path: "/" });
}
