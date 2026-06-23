const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const resolveImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("/uploads/")) return `${API_URL}${url}`;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/uploads/")) {
      return `${API_URL}${parsed.pathname}`;
    }
  } catch {}
  return url;
};

export const normalizeImageUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("/uploads/")) return url;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/uploads/")) return parsed.pathname;
  } catch {}
  return url;
};

export const resolveHtml = (html) => {
  if (!html) return html;
  return html.replace(/(<img\b[^>]*\s)src="([^"]*)"/g, (match, prefix, url) => {
    return `${prefix}src="${resolveImageUrl(url)}"`;
  });
};

export const normalizeHtml = (html) => {
  if (!html) return html;
  return html.replace(/(<img\b[^>]*\s)src="([^"]*)"/g, (match, prefix, url) => {
    return `${prefix}src="${normalizeImageUrl(url)}"`;
  });
};
