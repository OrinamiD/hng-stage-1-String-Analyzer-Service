import {} from "express";
export const validateString = async (req, res, next) => {
    const { value } = req.body;
    if (value === undefined && value === null && value.trim().length === 0) {
        return res
            .status(400)
            .json({ error: "Invalid request body or missing 'value' field" });
    }
    if (typeof value !== "string") {
        return res
            .status(422)
            .json({ error: "Invalid data type for 'value' (must be string)" });
    }
    next();
};
//# sourceMappingURL=string.middleware.js.map