import jwt from "jsonwebtoken";

const jsonwebtokenAdapter = {
  signToken: async (payload, secretOrPrivateKey, options) => {
    try {
      const token = jwt.sign(payload, secretOrPrivateKey, options);
      return token;
    } catch (error) {
      throw new Error(error);
    }
  },

  verifyToken: async (token, secretOrPublicKey, options) => {
    try {
      const decoded = jwt.verify(token, secretOrPublicKey, options);
      return decoded;
    } catch (error) {
      throw new Error(error);
    }
  },

  decodeToken: async (token, options) => {
    try {
      const decoded = jwt.decode(token, options);
      return decoded;
    } catch (error) {
      throw new Error(error);
    }
  },

  refreshToken: async (token, secretOrPrivateKey, options) => {
    try {
      const refreshedToken = jwt.refresh(token, secretOrPrivateKey, options);
      return refreshedToken;
    } catch (error) {
      throw new Error(error);
    }
  },
};

export default jsonwebtokenAdapter;
