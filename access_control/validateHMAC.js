import { fileURLToPath } from "url";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (receivedHmac, hmacEncryptionAlgorithm, dataString) => {
  if (hmacEncryptionAlgorithm !== "HMAC-SHA-256 (base64 encoded)") {
    throw new Error("Unsupported HMAC algorithm");
  }
  const signature = fs.readFileSync(
    path.join(__dirname, "keys/webhookSignature"),
    "utf8"
  );
  const hmac = crypto.createHmac("sha256", signature);
  hmac.update(dataString);
  const generatedHmacBase64 = hmac.digest("base64");

  return generatedHmacBase64 === receivedHmac;
};
