export const calculateProgress = (current, target) =>
  Math.min(((current || 0) / (target || 1)) * 100, 100);
