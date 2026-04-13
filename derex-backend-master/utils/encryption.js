const crypto = require("crypto");

function generateSHA512(text) {
  const hash = crypto.createHash("sha512");
  hash.update(text);
  return hash.digest("hex").toLowerCase();
}

function generateSHA256(text) {
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest("hex").toLowerCase();
}

const encryptSymmetric = (data, plainkey) => {
  const hash = crypto.createHash("sha256");
  hash.update(plainkey);
  const key = hash.digest("base64");

  const iv = crypto.randomBytes(12).toString("base64");
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let ciphertext = cipher.update(data, "utf8", "base64");
  ciphertext += cipher.final("base64");
  const tag = cipher.getAuthTag().toString("base64");

  return [ciphertext, iv, tag].join(":");
};

const decryptSymmetric = (data, plainkey) => {
  const hash = crypto.createHash("sha256");
  hash.update(plainkey);
  const key = hash.digest("base64");

  const [ciphertext, iv, tag] = data.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(Buffer.from(tag, "base64"));

  let plaintext = decipher.update(ciphertext, "base64", "utf8");
  plaintext += decipher.final("utf8");

  return plaintext;
};

module.exports = {
  generateSHA512,
  generateSHA256,
  decryptSymmetric,
  encryptSymmetric,
};
