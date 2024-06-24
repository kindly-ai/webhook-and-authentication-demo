import { fileURLToPath } from "url";
import crypto from "crypto";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (chatId, name) => {
  const privateKey = fs.readFileSync(
    path.join(__dirname, "keys/rsaPrivate.key"),
    "utf8"
  );

  const myUserId = crypto.randomUUID();

  const payload = {
    iss: "KindlyDemo",
    sub: myUserId,
    iat: Math.floor(Date.now() / 1000),
    chat: {
      id: chatId,
      webhook_domains: ["*.ngrok.app", "*.ngrok.io"],
    },
    name,
    email: "john.doe@example.com",
    email_verified: true,
    avatar: "https://gravatar.com/avatar/",
  };

  const signOptions = {
    algorithm: "RS256",
    expiresIn: "15m",
  };

  const token = jwt.sign(payload, privateKey, signOptions);
  return token;
};
