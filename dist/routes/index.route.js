import express, { Router } from "express";
const router = express.Router();
import stringRoute from "./string.route.js";
router.use("/analyze", stringRoute);
export default router;
//# sourceMappingURL=index.route.js.map