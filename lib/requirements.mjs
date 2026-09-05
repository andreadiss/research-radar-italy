// Bare application links and placeholders are not eligibility requirements.
export function meaningfulRequirements(values) {
  return [...new Set(values.filter((value) => typeof value === 'string').map((value) => value.trim()).filter((value) =>
    value && !/^(?:https?:\/\/|www\.|mailto:)[^\s]+$/i.test(value) &&
    !/^(?:other|altro|n\/?a|non specificat[oa]|not specified|-)\.?$/i.test(value)
  ))];
}
