export const getImageUrl = (path?: string): string => {
  if (!path) {
    return "https://avatar.iran.liara.run/public"; // default image
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  } else {
    // const baseUrl = "http://10.10.7.111:5000";
    const baseUrl = "https://api.raconliapp.com";
    return `${baseUrl}/${path}`;
  }
};
