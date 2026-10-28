import { z } from 'astro/zod';

import handsJson from './hands.json';

const gridSchema = z
  .strictObject({
    cols: z.number().int().positive(),
    rows: z.number().int().positive(),
    levels: z.array(z.string()),
    pill: z.strictObject({ x: z.number().positive(), y: z.number().positive(), r: z.number().positive() }),
  })
  .refine(
    grid =>
      grid.levels.length === grid.rows && grid.levels.every(row => row.length === grid.cols && /^[0-46-9]+$/.test(row)),
    'levels must be rows × cols digits 0..4 and 6..9',
  );

export const handsSchema = z.strictObject({ desktop: gridSchema, mobile: gridSchema });

export const hands = handsSchema.parse(handsJson);
