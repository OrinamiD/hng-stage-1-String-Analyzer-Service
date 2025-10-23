import { type Request, type Response } from "express";
import StringModel from "../models/string.model.js";
import {
  deleteByHash,
  getAllStringsService,
  parseNaturalLanguageQuery,
  stringToAnalyze,
} from "../services/string.service.js";

export const analyzeString = async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const properties = await stringToAnalyze(value as string);

    const existing = await StringModel.findOne({
      "properties.sha256_hash": properties.sha256_hash,
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "String already exists in the system" });
    }

    const newData = await StringModel.create({
      value,
      id: properties.sha256_hash,
      properties,
    });

    return res.status(201).json({
      id: newData.id,
      value: newData.value,
      properties: newData.properties,
      created_at: newData.created_at,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAStringValue = async (req: Request, res: Response) => {
  try {
    const { string_value } = req.params;

    const existing = await StringModel.findOne({
      "properties.sha256_hash": string_value,
    });

    if (!existing) {
      return res
        .status(404)
        .json({ error: "String does not exist in the system" });
    }

    return res.status(200).json({
      id: existing.id,
      value: existing.value,
      properties: existing.properties,
      created_at: existing.created_at,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllStrings = async (req: Request, res: Response) => {
  try {
    const result = await getAllStringsService(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: "Invalid query parameter values or types" });
  }
};

export const filterByNaturalLanguage = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string | undefined;

    if (!query || typeof query !== "string" || !query.trim()) {
      return res
        .status(400)
        .json({ error: "Unable to parse natural language query" });
    }

    const { parsedFilters, original } = parseNaturalLanguageQuery(query);
    const result = await getAllStringsService(parsedFilters);

    return res.status(200).json({
      data: result.data,
      count: result.count,
      interpreted_query: {
        original,
        parsed_filters: parsedFilters,
      },
    });
  } catch (error: any) {
    if (error.message.includes("conflicting")) {
      return res
        .status(422)
        .json({ error: "Query parsed but resulted in conflicting filters" });
    }
    return res
      .status(400)
      .json({ error: "Unable to parse natural language query" });
  }
};

export const deleteString = async (req: Request, res: Response) => {
  try {
    const { string_value } = req.params;
    const result = await deleteByHash(string_value as string);

    if (!result) {
      return res
        .status(404)
        .json({ error: "String does not exist in the system" });
    }

    return res.status(204).send();
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
