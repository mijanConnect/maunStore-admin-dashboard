export const getImageUrl = (path?: string): string => {
  if (!path) {
    return "https://avatar.iran.liara.run/public"; // default image
  }

  // Already an absolute URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Normalize leading slash so we don't produce double slashes
  const cleaned = path.replace(/^\/+/, "");
  const baseUrl = "https://api.raconliapp.com"; // no trailing slash
  // const baseUrl = "http://10.10.7.48:5000"; // no trailing slash
  return `${baseUrl}/${cleaned}`;
};
