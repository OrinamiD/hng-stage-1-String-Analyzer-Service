import { type Request, type Response, type NextFunction } from "express";

export const validateString = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { value } = req.body;

  if (value === undefined || value === null || value.trim().length === 0) {
    return res.status(400).json({ error: "Missing 'value' field" });
  }

  if (typeof value !== "string") {
    return res.status(422).json({ error: "Value must be a string" });
  }

  next();
};
