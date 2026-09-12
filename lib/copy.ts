export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : plural || `${singular}s`;
}

export function guestSummary(adults: number, children: number) {
  const a = `${adults} ${pluralize(adults, "adult")}`;
  if (!children) return a;
  return `${a}, ${children} ${pluralize(children, "child", "children")}`;
}
