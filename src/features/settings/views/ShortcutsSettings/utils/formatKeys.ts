export const formatKeys = (recordedKeys: Set<string>) => {
  const chars = [...recordedKeys];
  const joinedChars = chars.join("+");

  return joinedChars;
};
