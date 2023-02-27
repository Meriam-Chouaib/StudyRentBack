export const getApiResponse = (code: number, message: string, data?: any) => {
  return {
    code,
    message,
    data,
  };
};
