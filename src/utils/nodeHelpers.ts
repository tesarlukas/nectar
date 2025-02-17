export const appendJson = (value: string) => {
  return `${value}.json`;
};

export const stripJson = (value: string) => {
  return value.substring(0, value.lastIndexOf("."));
};
