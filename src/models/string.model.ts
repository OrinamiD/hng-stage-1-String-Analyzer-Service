import mongoose, { Document, Schema } from "mongoose";

export interface IString extends Document {
  id: string;
  value: string;
  properties: {
    length: number;
    is_palindrome: boolean;
    unique_value: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
  };
  created_at: Date;
}

const stringSchema = new Schema<IString>(
  {
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
  },
  { timestamps: true }
);

const StringModel = mongoose.model<IString>("StringModel", stringSchema);
export default StringModel;
