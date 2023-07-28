function isError(value: any): value is Error {
  return value instanceof Error;
}

export const getErrorMessage = (error: any) => {
  return isError(error) ? error.message : "unknown error";
};
