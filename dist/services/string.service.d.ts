export declare const stringToAnalyze: (value: string) => Promise<{
    length: number;
    is_palindrome: boolean;
    unique_value: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
}>;
export declare const stringValue: (value: string) => Promise<{
    existing: import("mongoose").Document<unknown, {}, import("../models/string.model.js").IString, {}, {}> & import("../models/string.model.js").IString & Required<{
        _id: unknown;
    }> & {
        __v: number;
    };
}>;
export declare const getAllStringsService: (filters: any) => Promise<{
    data: {
        id: unknown;
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
    }[];
    count: number;
    filters_applied: {
        is_palindrome: boolean | undefined;
        min_length: number | undefined;
        max_length: number | undefined;
        word_count: number | undefined;
        contains_character: any;
    };
}>;
export interface ParsedFilters {
    is_palindrome?: boolean;
    min_length?: number;
    max_length?: number;
    word_count?: number;
    contains_character?: string;
}
export declare const parseNaturalLanguageQuery: (query: string) => {
    parsedFilters: ParsedFilters;
    original: string;
};
export declare const deleteByValue: (value: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/string.model.js").IString, {}, {}> & import("../models/string.model.js").IString & Required<{
    _id: unknown;
}> & {
    __v: number;
}) | null>;
//# sourceMappingURL=string.service.d.ts.map