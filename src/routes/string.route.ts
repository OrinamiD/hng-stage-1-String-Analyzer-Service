import express, { Router } from "express";
import {
  analyzeString,
  deleteString,
  filterByNaturalLanguage,
  getAllStrings,
  getAStringValue,
} from "../controllers/string.controller.js";
import { validateString } from "../middlewares/string.middleware.js";

const router: Router = express.Router();

router.post("/strings", validateString, analyzeString);
router.get("/strings/:string_value", getAStringValue);
router.get("/strings", getAllStrings);
router.get("/strings/filter-by-natural-language", filterByNaturalLanguage);
router.delete("/strings/:string_value", deleteString);

export default router;
