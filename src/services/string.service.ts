import * as crypto from "crypto";
import StringModel from "../models/string.model.js";

// Create and analyze strings

export const stringToAnalyze = async (value: string) => {
  const length = value.length;
  const is_palindrome =
    value.toLowerCase() === value.toLowerCase().split("").reverse().join("");
  const unique_value = new Set(value).size;
  const word_count = value.trim().split(/\s+/).length;

  const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");

  const character_frequency_map: Record<string, number> = {};
  for (const char of value) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome,
    unique_value,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
};

// get specific string

export const stringValue = async (value: string) => {
  const existing = await StringModel.findOne({ value });

  if (!existing) {
    throw new Error("String does not exist in the system");
  }

  return {
    existing,
  };
};

//get all string with filtering

export const getAllStringsService = async (filters: any) => {
  const query: any = {};

  if (filters.is_palindrome !== undefined) {
    query["properties.is_palindrome"] = filters.is_palindrome === "true";
  }

  if (filters.min_length) {
    query["properties.length"] = { $gte: Number(filters.min_length) };
  }

  if (filters.max_length) {
    query["properties.length"] = {
      ...(query["properties.length"] || {}),
      $lte: Number(filters.max_length),
    };
  }

  if (filters.word_count) {
    query["properties.word_count"] = Number(filters.word_count);
  }

  if (filters.contains_character) {
    query.value = { $regex: filters.contains_character, $options: "i" };
  }


  const strings = await StringModel.find();

  // Format the response data
  const formattedData = strings.map((s) => ({
    id: s._id,
    value: s.value,
    properties: s.properties,
    created_at: s.created_at,
  }));

  console.log(formattedData);

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

//This Natural Language Filtering endpoint

export interface ParsedFilters {
  is_palindrome?: boolean;
  min_length?: number;
  max_length?: number;
  word_count?: number;
  contains_character?: string;
}

export const parseNaturalLanguageQuery = (
  query: string
): {
  parsedFilters: ParsedFilters;
  original: string;
} => {
  if (!query || typeof query !== "string") {
    throw new Error("Invalid query");
  }

  const lowerQuery = query.toLowerCase().trim();
  const filters: ParsedFilters = {};

  // ✅ palindromic / palindrome
  if (lowerQuery.includes("palindromic") || lowerQuery.includes("palindrome")) {
    filters.is_palindrome = true;
  }

  // ✅ single / two / three word
  if (lowerQuery.includes("single word") || lowerQuery.includes("one word")) {
    filters.word_count = 1;
  } else if (
    lowerQuery.includes("two words") ||
    lowerQuery.includes("two word")
  ) {
    filters.word_count = 2;
  } else {
    const explicitWordMatch = lowerQuery.match(
      /(\d+)\s*(?:-?\s*)?(?:words?|word)/
    );
    if (explicitWordMatch && explicitWordMatch[1]) {
      const n = parseInt(explicitWordMatch[1], 10);
      if (!Number.isNaN(n)) filters.word_count = n;
    }
  }

  // ✅ longer than X characters → min_length = X + 1
  const longerMatch = lowerQuery.match(/longer than\s+(\d+)/);
  if (longerMatch && longerMatch[1]) {
    const n = parseInt(longerMatch[1], 10);
    if (!Number.isNaN(n)) filters.min_length = n + 1;
  }

  // ✅ alternative phrasing: "greater than 10 characters"
  const longerMatchAlt = lowerQuery.match(
    /greater than\s+(\d+)\s*(?:characters|chars)?/
  );
  if (!filters.min_length && longerMatchAlt && longerMatchAlt[1]) {
    const n = parseInt(longerMatchAlt[1], 10);
    if (!Number.isNaN(n)) filters.min_length = n + 1;
  }

  // ✅ shorter than X characters → max_length = X - 1
  const shorterMatch = lowerQuery.match(/shorter than\s+(\d+)/);
  if (shorterMatch && shorterMatch[1]) {
    const n = parseInt(shorterMatch[1], 10);
    if (!Number.isNaN(n)) filters.max_length = n - 1;
  }

  // ✅ contains the letter x OR contain x
  const containsMatch = lowerQuery.match(
    /contain(?:s|ing)?(?: the letter)?\s+([a-z])/
  );
  if (containsMatch && containsMatch[1]) {
    filters.contains_character = containsMatch[1];
  }

  // ✅ heuristic: “first vowel” → 'a'
  if (!filters.contains_character && lowerQuery.includes("first vowel")) {
    filters.contains_character = "a";
  }

  // ✅ If nothing parsed → throw
  if (Object.keys(filters).length === 0) {
    throw new Error("Unable to parse natural language query");
  }

  // ✅ Validate conflicting filters (e.g., min_length > max_length)
  if (
    typeof filters.min_length === "number" &&
    typeof filters.max_length === "number" &&
    filters.min_length > filters.max_length
  ) {
    throw new Error("Parsed filters are conflicting: min_length > max_length");
  }

  return {
    parsedFilters: filters,
    original: query,
  };
};

// Delete String

export const deleteByValue = async (value: string) => {
  const result = await StringModel.findOneAndDelete({ value });
  return result;
};
