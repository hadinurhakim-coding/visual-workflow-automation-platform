import Cryptr from "cryptr";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error(
    "ENCRYPTION_KEY is required. Add a 32+ char random hex string to your .env. " +
      "Rotating this key invalidates every existing Credential — there is no migration path.",
  );
}

const cryptr = new Cryptr(ENCRYPTION_KEY);

export function encrypt(plaintext: string): string {
  return cryptr.encrypt(plaintext);
}

export function decrypt(ciphertext: string): string {
  return cryptr.decrypt(ciphertext);
}
