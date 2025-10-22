import mongoose, { Document } from "mongoose";
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
declare const StringModel: mongoose.Model<IString, {}, {}, {}, mongoose.Document<unknown, {}, IString, {}, {}> & IString & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default StringModel;
//# sourceMappingURL=string.model.d.ts.map