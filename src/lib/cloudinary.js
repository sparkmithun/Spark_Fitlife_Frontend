const CLOUD_NAME = 'dc1rxmw4j';
const UPLOAD_PRESET = 'Spark Fitlife';

/**
 * Upload an image directly to Cloudinary using unsigned upload.
 * This avoids sending large files through our backend.
 * @param {File} file - The image file to upload
 * @param {string} folder - Cloudinary folder (e.g. 'avatars', 'posts')
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(file, folder = 'spark-fitlife') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Image upload failed');
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}
