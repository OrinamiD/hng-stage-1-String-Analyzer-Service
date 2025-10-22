import express, { Router } from "express";

const router: Router = express.Router();

import stringRoute from "./string.route.js";

router.use("/analyze", stringRoute);

export default router;
