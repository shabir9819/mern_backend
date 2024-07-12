import express from "express";
import userRoute from "./routes/users.routes.js";
// import mastersRoute from "./routes/mastersRoutes.js";
import apiVersion from "../../../config/apiVersions.js";
const router = express.Router();

router.use(`/${apiVersion.v1}`, userRoute);
// router.use(`/${apiVersion.v1}/masters`, mastersRoute);

export default router;
