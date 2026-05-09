import "server-only";

export type JwtPayload = {
  sub?: string;
  role?: string;
  exp?: number;
};

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
}
