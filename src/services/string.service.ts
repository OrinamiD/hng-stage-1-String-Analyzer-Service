import * as crypto from "crypto";
import StringModel from "../models/string.model.js";

export interface ParsedFilters {
  is_palindrome?: boolean;
  min_length?: number;
  max_length?: number;
  word_count?: number;
  contains_character?: string;
}

export const stringToAnalyze = async (
  value: string
): Promise<{
  length: number;
  is_palindrome: boolean;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: Record<string, number>;
}> => {
  const length = value.length;

  // Case-insensitive palindrome (remove non-alphabetic chars)
  const cleanValue = value.toLowerCase().replace(/[^a-z]/g, "");
  const is_palindrome = cleanValue === cleanValue.split("").reverse().join("");

  // Unique characters count
  const unique_characters = new Set(value).size;

  // Word count
  const word_count = value.trim().split(/\s+/).filter(Boolean).length;

  // SHA-256 hash
  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");

  // Character frequency map
  const character_frequency_map: Record<string, number> = {};
  for (const char of value) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
};

export const getAllStringsService = async (filters: Record<string, any>) => {
  const query: any = {};

  // is_palindrome filter
  if (filters.is_palindrome !== undefined) {
    query["properties.is_palindrome"] = filters.is_palindrome === "true";
  }

  // length filters
  if (filters.min_length) {
    query["properties.length"] = {
      ...(query["properties.length"] || {}),
      $gte: Number(filters.min_length),
    };
  }

  if (filters.max_length) {
    query["properties.length"] = {
      ...(query["properties.length"] || {}),
      $lte: Number(filters.max_length),
    };
  }

  // word_count filter
  if (filters.word_count) {
    query["properties.word_count"] = Number(filters.word_count);
  }

  // contains_character filter
  if (filters.contains_character) {
    query.value = {
      $regex: new RegExp(filters.contains_character, "i"),
    };
  }

  const strings = await StringModel.find(query);

  const formattedData = strings.map((s) => ({
    id: s.id,
    value: s.value,
    properties: s.properties,
    created_at: s.created_at,
  }));

  return {
    data: formattedData,
    count: strings.length,
    filters_applied: {
      is_palindrome: filters.is_palindrome
        ? filters.is_palindrome === "true"
        : undefined,
      min_length: filters.min_length ? Number(filters.min_length) : undefined,
      max_length: filters.max_length ? Number(filters.max_length) : undefined,
      word_count: filters.word_count ? Number(filters.word_count) : undefined,
      contains_character: filters.contains_character || undefined,
    },
  };
};

export const parseNaturalLanguageQuery = (query: string) => {
  const lowerQuery = query.toLowerCase().trim();
  const filters: ParsedFilters = {};

  // Palindrome detection
  if (lowerQuery.includes("palindromic") || lowerQuery.includes("palindrome")) {
    filters.is_palindrome = true;
  }

  // Word count detection
  if (lowerQuery.includes("single word") || lowerQuery.includes("one word")) {
    filters.word_count = 1;
  } else {
    const wordMatch = lowerQuery.match(/(\d+)\s*(?:word|words)/);
    if (wordMatch) {
      filters.word_count = Number(wordMatch[1]);
    }
  }

  // Length filters
  const longerMatch = lowerQuery.match(/(?:longer|greater) than\s+(\d+)/);
  if (longerMatch) {
    filters.min_length = Number(longerMatch[1]) + 1;
  }

  const shorterMatch = lowerQuery.match(/shorter than\s+(\d+)/);
  if (shorterMatch) {
    filters.max_length = Number(shorterMatch[1]) - 1;
  }

  // Character detection
  const charMatch = lowerQuery.match(
    /contain(?:s|ing)?(?: the letter)?\s+([a-z])/
  );
if (charMatch && charMatch[1]) {  // ✅ Explicit null check
    filters.contains_character = charMatch[1];
  }

  // First vowel heuristic
  if (lowerQuery.includes("first vowel") && !filters.contains_character) {
    filters.contains_character = "a";
  }

  if (Object.keys(filters).length === 0) {
    throw new Error("Unable to parse natural language query");
  }

  // Check for conflicting filters
  if (
    filters.min_length &&
    filters.max_length &&
    filters.min_length > filters.max_length
  ) {
    throw new Error("Parsed filters are conflicting: min_length > max_length");
  }

  return { parsedFilters: filters, original: query };
};

export const deleteByHash = async (hash: string) => {
  return await StringModel.findOneAndDelete({
    "properties.sha256_hash": hash,
  });
};
