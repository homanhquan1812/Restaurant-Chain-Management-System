export const normalizeRole = (rawRole: string): string => {
  return rawRole.trim().toUpperCase().replace(/\s+/g, "_");
};
