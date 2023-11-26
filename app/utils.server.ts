import crypto from "crypto";
import * as bcrypt from "bcrypt";
import sharp from "sharp";

export function uuid() {
  return crypto.randomUUID();
}

export function hash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export function compareHash(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export async function validateBase64Image(
  base64String: string
): Promise<boolean> {
  try {
    const buffer = Buffer.from(base64String, "base64");

    const metadata = await sharp(buffer).metadata();

    if (
      (metadata.format === "png" || metadata.format === "jpeg") &&
      metadata.width &&
      metadata.height &&
      metadata.width <= 1024 &&
      metadata.height <= 1024
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error validating base64 image:", error);
    return false;
  }
}
