const crypto = require("crypto");

const encode = (value) => Buffer.from(value).toString("base64url");

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters.");
  }
  return secret;
};

const signToken = (userId) => {
  const header = encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = encode(JSON.stringify({
    sub: userId.toString(),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  }));
  const content = `${header}.${payload}`;
  const signature = crypto.createHmac("sha256", getSecret()).update(content).digest("base64url");
  return `${content}.${signature}`;
};

const verifyToken = (token) => {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token.");

  const [headerPart, payloadPart, signaturePart] = parts;
  const header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
  if (header.alg !== "HS256") throw new Error("Invalid token algorithm.");

  const expected = crypto.createHmac("sha256", getSecret())
    .update(`${headerPart}.${payloadPart}`)
    .digest();
  const received = Buffer.from(signaturePart, "base64url");
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
    throw new Error("Invalid token signature.");
  }

  const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
  if (!payload.sub || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired or invalid.");
  }
  return payload;
};

module.exports = { signToken, verifyToken };
