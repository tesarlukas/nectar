export const appendJson = (value: string) => {
  return value.endsWith(".json") ? value : `${value}.json`;
};

export const stripJson = (value?: string) => {
  return value?.substring(0, value.lastIndexOf("."));
};
