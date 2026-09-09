export function evaluateSourceFreshness(lastSuccessfulCheckAt, now = new Date(), thresholdHours = 48) {
  const checkedAt = Date.parse(lastSuccessfulCheckAt);
  const currentTime = now instanceof Date ? now.getTime() : Date.parse(now);
  if (!Number.isFinite(checkedAt) || !Number.isFinite(currentTime) || checkedAt > currentTime) {
    return { status: "invalid", ageHours: null };
  }

  const ageHours = (currentTime - checkedAt) / 3600000;
  return {
    status: ageHours > thresholdHours ? "stale" : "fresh",
    ageHours: Number(ageHours.toFixed(2))
  };
}
