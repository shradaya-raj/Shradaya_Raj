import { Item } from './types';

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']);
const videoExtensions = new Set(['.mp4', '.webm', '.mov', '.m4v']);

function getExt(name: string): string {
  const idx = name.lastIndexOf('.');
  return idx >= 0 ? name.slice(idx).toLowerCase() : '';
}

function isAbsoluteAssetPath(value: string): boolean {
  return value.startsWith('/');
}

export function isImageFile(value: string): boolean {
  if (isAbsoluteAssetPath(value)) return true;
  return imageExtensions.has(getExt(value));
}

export function isVideoFile(value: string): boolean {
  if (isAbsoluteAssetPath(value)) return false;
  return videoExtensions.has(getExt(value));
}

export function resolveItemAssetPath(item: Pick<Item, 'category' | 'slug'>, fileNameOrPath: string): string {
  return isAbsoluteAssetPath(fileNameOrPath)
    ? fileNameOrPath
    : `/images/${item.category}/${item.slug}/${fileNameOrPath}`;
}

export function getPrimaryImagePath(item: Item): string | undefined {
  const fromImages = item.images?.find((img) => isImageFile(img));
  if (fromImages) return resolveItemAssetPath(item, fromImages);
  return undefined;
}

export function getAttachmentPaths(item: Item): string[] {
  const fromAttachments = (item.attachments ?? []).map((f) => resolveItemAssetPath(item, f));
  const legacyNonImageFiles = (item.images ?? [])
    .filter((f) => !isImageFile(f))
    .map((f) => resolveItemAssetPath(item, f));

  return Array.from(new Set([...fromAttachments, ...legacyNonImageFiles]));
}
