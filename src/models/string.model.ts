import mongoose, { Document, Schema } from "mongoose";

export interface IString extends Document {
  id: string;
  value: string;
  properties: {
    length: number;
    is_palindrome: boolean;
    sha256_hash: string;
    language: string;
  };
  created_at: Date;
}

const stringSchema = new Schema<IString>(
  {
    id: { type: String, required: true, unique: true },
    value: { type: String, required: true, trim: true },
    properties: {
      length: { type: Number, required: true },
      is_palindrome: { type: Boolean, required: true },
      sha256_hash: { type: String, required: true },
      language: { type: String, default: "en" }
    },
  },
  { timestamps: true }
);

const StringModel = mongoose.model<IString>("StringModel", stringSchema);
export default StringModel;