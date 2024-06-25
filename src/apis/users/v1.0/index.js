import express from "express";
import userRoute from "./routes/usersRoute.js";
import apiVersion from "../../../config/apiVersions.js";
const router = express.Router();

router.use(`/${apiVersion.v1}`, userRoute);

export default router;
