export const getBackendBaseUrl = (): string => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:3000";

  if (apiUrl.includes("/api-gateway")) {
    return apiUrl.replace("/api-gateway", "");
  }

  return apiUrl;
};

export const resolveImageUrl = (photoUrl?: string | null): string => {
  if (!photoUrl || typeof photoUrl !== "string") return "";

  if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
    return photoUrl;
  }

  const baseUrl = getBackendBaseUrl();
  const normalizedPhoto = photoUrl.startsWith("/") ? photoUrl : `/${photoUrl}`;

  return `${baseUrl}${normalizedPhoto}`;
};
