const BAND_TABLE: [number, number, number][] = [
  [39, 40, 9.0],
  [37, 38, 8.5],
  [35, 36, 8.0],
  [33, 34, 7.5],
  [30, 32, 7.0],
  [27, 29, 6.5],
  [23, 26, 6.0],
  [19, 22, 5.5],
  [15, 18, 5.0],
  [13, 14, 4.5],
  [10, 12, 4.0],
  [8, 9, 3.5],
  [6, 7, 3.0],
  [4, 5, 2.5],
  [0, 3, 2.0],
];

export function rawToBand(rawCorrect: number, totalQuestions: number): number {
  // Normalize if totalQuestions ≠ 40
  const normalized = totalQuestions === 40
    ? rawCorrect
    : Math.round((rawCorrect / totalQuestions) * 40);

  for (const [min, max, band] of BAND_TABLE) {
    if (normalized >= min && normalized <= max) {
      return band;
    }
  }
  return 2.0;
}
