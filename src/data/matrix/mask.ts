import { z } from 'astro/zod';

import maskJson from './mask.json';

const gridSchema = z
  .strictObject({
    cols: z.number().int().positive(),
    rows: z.number().int().positive(),
    levels: z.array(z.string()),
  })
  .refine(
    grid =>
      grid.levels.length === grid.rows &&
      grid.levels.every(row => row.length === grid.cols && /^[0-46-9a-d]+$/.test(row)),
    'levels must be rows × cols characters 0..4, 6..9 and a..d',
  );

export const maskSchema = z.strictObject({
  ratio: z.number().positive(),
  desktop: gridSchema,
  mobile: gridSchema,
});

export const mask = maskSchema.parse(maskJson);
