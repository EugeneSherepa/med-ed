const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Convert any URL (relative or absolute, any domain) to a displayable URL using the current API_URL.
// Handles: "/uploads/...", "http://localhost:3000/uploads/...", "https://old-domain.com/uploads/..."
export const resolveImageUrl = (url) => {
  if (!url) return url;
  // Already a relative /uploads/ path
  if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
  // Absolute URL with any host — replace the origin with current API_URL
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/uploads/")) {
      return `${API_URL}${parsed.pathname}`;
    }
  } catch {
    // not a valid URL, return as-is
  }
  return url;
};

// Convert any image URL to a relative path for storage in the DB.
export const normalizeImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("/uploads/")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/uploads/")) return parsed.pathname;
  } catch {
    // not a valid URL, return as-is
  }
  return url;
};

// Process stored HTML content: fix all img src attributes for display.
// Handles both old absolute (any-host) URLs and new relative paths.
export const resolveHtml = (html) => {
  if (!html) return html;
  return html.replace(/(<img\b[^>]*\s)src="([^"]*)"/g, (match, prefix, url) => {
    return `${prefix}src="${resolveImageUrl(url)}"`;
  });
};

// Normalize all img src attributes in HTML to relative paths for storage.
export const normalizeHtml = (html) => {
  if (!html) return html;
  return html.replace(/(<img\b[^>]*\s)src="([^"]*)"/g, (match, prefix, url) => {
    return `${prefix}src="${normalizeImageUrl(url)}"`;
  });
};
