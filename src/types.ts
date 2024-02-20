export type Side = 'top' | 'bottom';

/**
 * CheckerSourceIndex is either 'bar', or indexes 0-23 mapping onto points 1-24 relative to Red player
 */
export type CheckerSourceIndex = 'bar' | number;

export type BoxDimensions = { width: number; height: number };
