import express from "express";
import userRoute from "./routes/usersRoute.js";
const router = express.Router();
const version = "v1";

router.use(`/user/${version}`, userRoute);

export default router;
