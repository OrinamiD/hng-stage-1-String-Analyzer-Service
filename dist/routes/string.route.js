import express, { Router } from "express";
import { analyzeString, deleteString, filterByNaturalLanguage, getAllStrings, getAStringValue, } from "../controllers/string.controller.js";
const router = express.Router();
router.post("/strings", analyzeString);
router.get("/strings/:value", getAStringValue);
router.get("/strings", getAllStrings);
router.get("/filter-by-natural-language", filterByNaturalLanguage);
router.delete("/strings/:value", deleteString);
export default router;
//# sourceMappingURL=string.route.js.map