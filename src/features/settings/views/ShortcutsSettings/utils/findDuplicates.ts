export const findDuplicates = <T>(array: T[]): T[] => {
  const occurrences = array.reduce<Record<string, number>>((acc, curr) => {
    const key = String(curr);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Array.from(
    new Set(
      Object.entries(occurrences)
        .filter(([_, count]) => count > 1)
        .map(([key, _]) => key),
    ),
  ) as T[];
};
