import crypto from "crypto";

const cryptoAdapter = {
  generateRandomBytes: async (size) => {
    try {
      const buffer = await new Promise((resolve, reject) => {
        crypto.randomBytes(size, (err, buf) => {
          if (err) reject(err);
          else resolve(buf);
        });
      });
      return buffer.toString("hex"); // Convert buffer to hex string
    } catch (error) {
      throw new Error(error);
    }
  },

  createHash: async (algorithm, data) => {
    try {
      const hash = crypto.createHash(algorithm).update(data).digest("hex");
      return hash;
    } catch (error) {
      throw new Error(error);
    }
  },

  createHmac: async (algorithm, key, data) => {
    try {
      const hmac = crypto.createHmac(algorithm, key).update(data).digest("hex");
      return hmac;
    } catch (error) {
      throw new Error(error);
    }
  },

  encrypt: async (algorithm, key, iv, data) => {
    try {
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(data, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    } catch (error) {
      throw new Error(error);
    }
  },

  decrypt: async (algorithm, key, iv, encryptedData) => {
    try {
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (error) {
      throw new Error(error);
    }
  },

  pbkdf2: async (password, salt, iterations, keylen, digest) => {
    try {
      const derivedKey = await new Promise((resolve, reject) => {
        crypto.pbkdf2(
          password,
          salt,
          iterations,
          keylen,
          digest,
          (err, derivedKey) => {
            if (err) reject(err);
            else resolve(derivedKey.toString("hex"));
          }
        );
      });
      return derivedKey;
    } catch (error) {
      throw new Error(error);
    }
  },

  generateKeyPair: async (type, options) => {
    try {
      const keyPair = await new Promise((resolve, reject) => {
        crypto.generateKeyPair(type, options, (err, publicKey, privateKey) => {
          if (err) reject(err);
          else resolve({ publicKey, privateKey });
        });
      });
      return keyPair;
    } catch (error) {
      throw new Error(error);
    }
  },

  generateKeyPairSync: (type, options) => {
    try {
      const { publicKey, privateKey } = crypto.generateKeyPairSync(
        type,
        options
      );
      return { publicKey, privateKey };
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default cryptoAdapter;
