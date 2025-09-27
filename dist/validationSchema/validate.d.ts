import { Request, Response } from "express";
import { z } from "zod";
export declare const validate: (schema: z.ZodSchema) => (req: Request, res: Response, next: Function) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.d.ts.map