import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET as string;
const COOKIE_NAME = "zaan_session";

export type SessionUser = {
  id: string;
  username: string;
};

export function createSessionToken(user: SessionUser) {
  return jwt.sign(user, SECRET, { expiresIn: "30d" });
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, SECRET) as SessionUser;
  } catch {
    return null;
  }
}

export function getSessionFromCookies(): SessionUser | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
