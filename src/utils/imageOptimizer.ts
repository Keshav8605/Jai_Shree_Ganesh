/**
 * Image Optimizer Utility for YOU & ME
 * Resizes and compresses client-side images using HTML5 Canvas
 * to prevent localStorage quota exhaustion and oversized URL share payloads.
 */

export interface OptimizeImageResult {
  dataUrl: string;
  originalSizeKb: number;
  compressedSizeKb: number;
  dimensions: { width: number; height: number };
}

export async function optimizeImageFile(
  file: File,
  maxDimension = 400,
  quality = 0.65
): Promise<OptimizeImageResult> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file (JPG, PNG, WebP).");
  }

  // Reject files larger than 10MB to prevent browser freezing
  const fileSizeMb = file.size / (1024 * 1024);
  if (fileSizeMb > 10) {
    throw new Error(
      `File is too large (${fileSizeMb.toFixed(1)}MB). Please choose an image under 10MB.`
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error("Failed to read image file. Please try again."));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error("Failed to decode image. File may be corrupted."));
      };

      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate new dimensions preserving aspect ratio
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          // Render onto canvas
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Unable to initialize canvas context."));
            return;
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Optional subtle white background for transparent PNGs
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, width, height);

          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          const compressedSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
          const originalSizeKb = Math.round(file.size / 1024);

          resolve({
            dataUrl,
            originalSizeKb,
            compressedSizeKb,
            dimensions: { width, height },
          });
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Failed to process image."));
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
