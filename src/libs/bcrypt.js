import bcrypt from "bcrypt";

const bcryptAdapter = {
  hash: async (plainText, saltRounds) => {
    try {
      const hashedPassword = await bcrypt.hash(plainText, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(error);
    }
  },

  compare: async (plainText, hashedPassword) => {
    try {
      const match = await bcrypt.compare(plainText, hashedPassword);
      return match;
    } catch (error) {
      throw new Error(error);
    }
  },

  genSalt: async (saltRounds) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      return salt;
    } catch (error) {
      throw new Error(error);
    }
  },

  hashSync: (plainText, saltRounds) => {
    try {
      const hashedPassword = bcrypt.hashSync(plainText, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(error);
    }
  },

  compareSync: (plainText, hashedPassword) => {
    try {
      const match = bcrypt.compareSync(plainText, hashedPassword);
      return match;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default bcryptAdapter;
