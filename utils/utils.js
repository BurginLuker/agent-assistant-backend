export const handleError = (res, error) => {
  console.log(error);
  const message = error?.message ?? "An unexpected error occurred";
  return res.status(500).json({
    err: message,
  });
};
