export type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

export type Go = { moves: Move[] };

export type Move = { sourceIndex: number; destinationIndex: number };

export type Side = 'top' | 'bottom';
