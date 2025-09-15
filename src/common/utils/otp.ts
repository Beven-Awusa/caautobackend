export const generateOTP = (length: number = 6) => {
  const expiresIn = new Date(Date.now() + 5 * 60 * 1000);
  const token = Math.floor(
    10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1),
  ).toString();
  return { expiresIn, token };
};
