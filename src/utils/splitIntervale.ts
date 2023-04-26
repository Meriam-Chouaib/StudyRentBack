export const SplitInterval = (intervale) => {
  return (intervale as string)?.split('-')?.map(Number);
};
