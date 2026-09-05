// Keep repeated scientific sectors; contact/identity fields retain their first value.
export function extractTableFields(html) {
  const fields = Object.create(null);
  const normalizedHtml = html.replace(/\r?\n/g, " ");

  for (const [, rawLabel, rawValue] of normalizedHtml.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>\s*<td\b[^>]*>([\s\S]*?)<\/td>/gi)) {
    const label = normalizeLabel(stripHtml(rawLabel));
    const value = stripHtml(rawValue);

    if (!label || !value) continue;
    if (!fields[label]) fields[label] = value;
    else if (["G.S.D.", "S.S.D"].includes(label) && !fields[label].split("\n").includes(value)) {
      fields[label] += `\n${value}`;
    }
  }

  return fields;
}

export function stripHtml(value) {
  return decodeHtml(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function normalizeLabel(value) {
  const label = decodeHtml(value)
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .replace(/:$/, "")
    .trim();
  if (/^G\.?S\.?D\.?$/i.test(label)) return "G.S.D.";
  if (/^S\.?S\.?D\.?$/i.test(label)) return "S.S.D";
  return label;
}

export function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&agrave;/g, "à")
    .replace(/&egrave;/g, "è")
    .replace(/&eacute;/g, "é")
    .replace(/&igrave;/g, "ì")
    .replace(/&ograve;/g, "ò")
    .replace(/&ugrave;/g, "ù")
    .replace(/&Agrave;/g, "À")
    .replace(/&Egrave;/g, "È")
    .replace(/&Eacute;/g, "É")
    .replace(/&Igrave;/g, "Ì")
    .replace(/&Ograve;/g, "Ò")
    .replace(/&Ugrave;/g, "Ù")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

