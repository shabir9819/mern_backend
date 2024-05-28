import mongooseAdapter from "../libs/mongoose.js";
const mongoDbUri = process.env.MONGO_DB_URI;

const connectToMongo = async () => {
  try {
    const connection = await mongooseAdapter.connect(`${mongoDbUri}/node2`, {});
    return connection; // Return connection object
  } catch (e) {
    console.error("MongoDB connection error:", e.message);
    throw new Error(e); // Re-throw the error for calling code to handle
  }
};

export default connectToMongo;
