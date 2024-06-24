import { fileURLToPath } from "url";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (authorization, chatId) => {
  const publicKey = fs.readFileSync(
    path.join(__dirname, "keys/rsaPublic.key"),
    "utf8"
  );

  return new Promise((resolve, reject) => {
    jwt.verify(authorization, publicKey, {}, (err, decoded) => {
      if (err) {
        reject(new Error("JWT verification failed"));
      } else {
        if (decoded.chat.id !== chatId) {
          throw new Error("Invalid chat ID in JWT");
        }
        resolve(decoded);
      }
    });
  });
};
