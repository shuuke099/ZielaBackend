import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

/* =========================
   🔐 ENV VALIDATION
========================= */

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("Missing JWT secrets in environment variables");
}

/* =========================
   🧠 TYPES
========================= */

export interface TokenPayload extends JwtPayload {
  userId: string;
  role: string;
  type: "access" | "refresh";
}

/* =========================
   ⚙️ CONFIG
========================= */

const ACCESS_TOKEN_OPTIONS: SignOptions = {
  expiresIn: "15m",
  issuer: "zeila-api",
  audience: "zeila-users",
};

const REFRESH_TOKEN_OPTIONS: SignOptions = {
  expiresIn: "7d",
  issuer: "zeila-api",
  audience: "zeila-users",
};

/* =========================
   🔐 TOKEN SERVICE
========================= */

export const tokenService = {
  /* ========= GENERATE ========= */

  generateAccessToken(payload: Omit<TokenPayload, "type">): string {
    return jwt.sign(
      { ...payload, type: "access" },
      ACCESS_SECRET,
      ACCESS_TOKEN_OPTIONS,
    );
  },

  generateRefreshToken(payload: Omit<TokenPayload, "type">): string {
    return jwt.sign(
      { ...payload, type: "refresh" },
      REFRESH_SECRET,
      REFRESH_TOKEN_OPTIONS,
    );
  },

  /* ========= VERIFY ========= */

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, ACCESS_SECRET) as TokenPayload;

      if (decoded.type !== "access") {
        throw new Error("Invalid token type");
      }

      return decoded;
    } catch {
      throw new Error("Invalid or expired access token");
    }
  },

  verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET) as TokenPayload;

      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      return decoded;
    } catch {
      throw new Error("Invalid or expired refresh token");
    }
  },
};
