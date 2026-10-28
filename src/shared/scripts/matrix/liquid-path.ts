import { at } from '@/utils/list';

export const LIQUID_POINTS = 14;

export const blobPath = (offsets: readonly number[], radius: number, cx: number, cy: number): string => {
  const count = offsets.length;
  const points = offsets.map((offset, i) => {
    const angle = (i / count) * Math.PI * 2;
    return [cx + Math.cos(angle) * (radius + offset), cy + Math.sin(angle) * (radius + offset)] as const;
  });
  const n = (value: number) => value.toFixed(1);

  const start = at(points, 0);
  let path = `M${n(start[0])} ${n(start[1])}`;
  for (let i = 0; i < count; i++) {
    const p0 = at(points, (i - 1 + count) % count);
    const p1 = at(points, i);
    const p2 = at(points, (i + 1) % count);
    const p3 = at(points, (i + 2) % count);
    path += `C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])} ${n(p2[1])}`;
  }
  return `${path}Z`;
};
