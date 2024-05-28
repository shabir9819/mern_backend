import mongoose from "mongoose";

const mongooseAdapter = {
  Schema: mongoose.Schema,

  connect: async (uri, options) => {
    try {
      await mongoose.connect(uri, options);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw new Error(error);
    }
  },

  disconnect: async () => {
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
      throw new Error(error);
    }
  },

  model: (name, schema) => {
    return mongoose.model(name, schema);
  },

  save: async (document) => {
    try {
      await document.save();
      console.log("Document saved successfully");
    } catch (error) {
      console.error("Error saving document:", error);
      throw new Error(error);
    }
  },
  set: (key, value) => {
    mongoose.set(key, value);
  },
};

export default mongooseAdapter;
