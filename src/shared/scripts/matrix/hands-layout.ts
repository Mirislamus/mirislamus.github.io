// How the two glyph hands of the pill scene sit side by side: the second one is the mirror image of the first, with
// some empty columns between them. Shared by the page (where the buttons go) and the canvas drawing.
const HANDS_GAP_SHARE = 0.3; // of one hand's width

export const handsGap = (cols: number) => Math.round(cols * HANDS_GAP_SHARE);
