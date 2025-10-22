import { type Request, type Response } from "express";
export declare const analyzeString: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAStringValue: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllStrings: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const filterByNaturalLanguage: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteString: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=string.controller.d.ts.map