const normalizeBaseUrl = (value: string) => value.replace(/\/$/, "");

export const getApiBaseUrl = () => {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!value) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is required.");
  }

  return normalizeBaseUrl(value);
};
