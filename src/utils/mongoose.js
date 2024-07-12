import mastersData from "../apis/users/v1.0/models/mastersData.model.js";
import envKeys from "../config/envKeys.js";
import serverMastersData from "../constants/serverMastersData.js";
import mongooseAdapter from "../libs/mongoose.js";
import schedule from "node-schedule";

const mongoDbUri = envKeys.mongoDbUri;

const setServerMastersData = async () => {
  try {
    // await mastersData.BloodGroups.insertMany(serverMastersData.bloodGroups);
    // await mastersData.Motorcycles.insertMany(serverMastersData.motorcycleNames);
    // await mastersData.MotorcyclePart.insertMany(
    //   serverMastersData.motorcyclePartNames
    // );
    // await mastersData.ExpenseType.insertMany(serverMastersData.expenseTypes);
    // await mastersData.RideCancelReason.insertMany(
    //   serverMastersData.rideCancelReasons
    // );
    console.log("Data inserted successfully");
  } catch (e) {
    console.error("Error inserting server masters data:", e.message);
    throw e; // Re-throw the error to propagate it up
  }
};

const connectToMongo = async () => {
  try {
    const connection = await mongooseAdapter.connect(
      `${mongoDbUri}/Roadbee`,
      {}
    );
    // console.log(new Date().toLocaleString());
    // schedule.scheduleJob("*/10 * * * * *", async () => {
    //   console.log("Checking for inactive users...");
    //   console.log(new Date().toLocaleString());
    // });

    // setServerMastersData();

    return connection; // Return connection object
  } catch (e) {
    console.error("MongoDB connection error:", e.message);
    throw new Error(e); // Re-throw the error for calling code to handle
  }
};

export default connectToMongo;
