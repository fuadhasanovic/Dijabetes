
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove standard diacritics
    .replace(/đ/g, "d")
    .replace(/ć/g, "c")
    .replace(/č/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");
}

export function fuzzyMatch(text: string, searchTerm: string): boolean {
  if (!searchTerm) return true;
  const normalizedText = normalizeString(text);
  const normalizedSearch = normalizeString(searchTerm);
  return normalizedText.includes(normalizedSearch);
}
