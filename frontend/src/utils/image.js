export const getImageUrl = (path) => {
  if (!path) return "/placeholder.png";

  // already absolute
  if (path.startsWith("http")) return path;

  // ensure leading slash
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return `http://localhost:8080${path}`;
};