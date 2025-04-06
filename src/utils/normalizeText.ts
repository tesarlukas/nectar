export const normalizeText = (text: string): string => {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: not really miss leading
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
  );
};
