// Hướng lật trang đang chờ: 1 = Next (lật sang trái), -1 = Prev, 0 = không lật.
// Biến cấp module (client) để sống sót qua lần remount của template.
export const pageFlip = { dir: 0 as -1 | 0 | 1 };
