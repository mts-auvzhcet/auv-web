// Uploads an image file directly from the browser to Cloudinary (unsigned
// upload — no backend involved, no API secret exposed) and returns the
// resulting hosted URL. This URL is what gets stored in the DB from now on,
// instead of a giant base64 string — this is the actual fix for the
// original "ran out of DB network transfer" problem.
//
// Requires these two Vite env vars to be set wherever the frontend is built:
//   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
//   VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset-name

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB raw upload cap (Cloudinary preset further compresses on top of this)

export async function uploadImage(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Image hosting isn't configured yet — set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.",
    );
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error(`That image is ${(file.size / 1024 / 1024).toFixed(1)}MB — please use one under 5MB.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Image upload failed. Please try again.");
  }

  const data = await res.json();
  return data.secure_url;
}
