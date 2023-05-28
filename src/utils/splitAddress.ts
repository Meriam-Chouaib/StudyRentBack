export const splitAddress = (address: string) => {
  return address.split(',').map((item) => item.trim());
};
