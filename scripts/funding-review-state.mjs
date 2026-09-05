// A past confirmation is reusable only for the same source and unchanged record.
export function hasCurrentFundingConfirmation(item, review) {
  if (!review || review.after !== item.fundingType || review.sourceUrl !== item.sourceUrl) return false;
  const reviewed = Date.parse(review.checkedAt);
  const updated = Date.parse(item.updatedAt);
  return Number.isFinite(reviewed) && Number.isFinite(updated) && updated <= reviewed;
}
