import imageCompression from "browser-image-compression";

export const compressImage = async (
  file: File,
  quality: number = 0.8,
  maxWidth: number = 1920
): Promise<Blob> => {
  const options = {
    maxSizeMB: 10,
    maxWidthOrHeight: maxWidth,
    useWebWorker: true,
    initialQuality: quality,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};
