import dotenv from "dotenv";
dotenv.config();

const dotenvAdapter = {
  getConfig: async () => {
    try {
      const config = dotenv.config();
      return config;
    } catch (error) {
      throw new Error(error);
    }
  },

  getVariable: async (key) => {
    try {
      const value = process.env[key];
      if (value === undefined) {
        throw new Error(`Environment variable '${key}' is not defined.`);
      }
      return value;
    } catch (error) {
      throw new Error(error);
    }
  },

  setVariable: async (key, value) => {
    try {
      process.env[key] = value;
    } catch (error) {
      throw new Error(error);
    }
  },

  unsetVariable: async (key) => {
    try {
      delete process.env[key];
    } catch (error) {
      throw new Error(error);
    }
  },
};
export default dotenvAdapter;
