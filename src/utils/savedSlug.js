export const getTestSlug = (test) => {
  if (test.type === "BASE") {
    const nameSlug = (test.title || "base")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return `${nameSlug}-${test.id}`;
  }
  if (test.type === "AMPS") {
    const parts = [String(test.year), "amps"];
    if (test.language) parts.push(test.language === "en" ? "eng" : "ukr");
    parts.push(String(test.id));
    return parts.join("-");
  }
  const parts = [String(test.year)];
  if (test.day) parts.push(`day-${test.day}`);
  if (test.language) parts.push(test.language === "en" ? "eng" : "ukr");
  if (test.variant) parts.push(`v${test.variant}`);
  parts.push(String(test.id));
  return parts.join("-");
};

export const getTestIdFromSlug = (slug) => {
  const parts = slug.split("-");
  return parseInt(parts[parts.length - 1], 10);
};
