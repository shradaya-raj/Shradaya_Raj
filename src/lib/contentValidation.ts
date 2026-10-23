export function isCategory(value: string): value is 'projects' | 'achievements' | 'eca' {
  return ['projects', 'achievements', 'eca'].includes(value);
}
export function isSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 220;
}
