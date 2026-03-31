type MediaType = 'image' | 'video';

function getCloudName() {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || '';
}

function encodePublicId(publicId: string) {
  return encodeURIComponent(publicId.trim()).replace(/%2F/g, '/');
}

function buildCloudinaryUrl(type: MediaType, publicId: string, transformations: string) {
  const cloudName = getCloudName();
  if (!cloudName || !publicId.trim()) return null;

  return `https://res.cloudinary.com/${cloudName}/${type}/upload/${transformations}/${encodePublicId(publicId)}`;
}

export function getCloudinaryVideoUrl(publicId: string) {
  // f_auto + q_auto preserves quality on fast networks and compresses on slower links.
  return buildCloudinaryUrl('video', publicId, 'f_auto,q_auto');
}

export function getCloudinaryImageUrl(publicId: string) {
  return buildCloudinaryUrl('image', publicId, 'f_auto,q_auto');
}
