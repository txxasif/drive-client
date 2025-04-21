"use client";

import { ENCRYPTION_KEY } from "@/config";
import crypto from "crypto";

// here remove any error
const algorithm = "aes-256-cbc";
const key = crypto
  .createHash("sha256")
  .update(String(ENCRYPTION_KEY))
  .digest("base64")
  .slice(0, 32);
const ivLength = 16;

const encrypt = (password: string): string => {
  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const decrypt = (encryptedPassword: string): string => {
  const [ivString, encrypted] = encryptedPassword.split(":");
  if (ivString && ivString.length !== ivLength * 2) {
    throw new Error("Invalid IV length");
  }
  const iv: Buffer = Buffer.from(ivString || "", "hex");

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted: string =
    encrypted && decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { decrypt, encrypt };
