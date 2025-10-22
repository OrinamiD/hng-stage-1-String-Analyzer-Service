import mongoose, { Document, Schema } from "mongoose";
const stringSchema = new Schema({
    id: { type: String },
    value: { type: String, trim: true },
    properties: {
        length: { type: Number },
        is_palindrome: { type: Boolean },
        unique_value: { type: Number },
        word_count: { type: Number },
        sha256_hash: { type: String },
        character_frequency_map: { type: Map, of: Number },
    },
    created_at: { type: Date },
}, { timestamps: true });
const StringModel = mongoose.model("StringModel", stringSchema);
export default StringModel;
//# sourceMappingURL=string.model.js.map