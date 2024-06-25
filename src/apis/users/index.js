import express from "express";
import userApi_v_1 from "./v1.0/index.js";
const router = express.Router();

router.use(`/users`, userApi_v_1);

export default router;
