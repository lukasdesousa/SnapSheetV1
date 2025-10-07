import jsPDF from "jspdf";
import { PdfConfig } from "@/components/PdfSettings";

export const generatePDF = async (images: File[], config: PdfConfig) => {
  const pdf = new jsPDF({
    orientation: config.orientation,
    unit: "mm",
    format: config.pageSize,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = config.margin;
  const spacing = config.spacing;
  const availableWidth = pageWidth - 2 * margin;
  const availableHeight = pageHeight - 2 * margin;

  let isFirstImage = true;

  for (const image of images) {
    if (!isFirstImage) {
      pdf.addPage();
    }
    isFirstImage = false;

    const imageData = await readFileAsDataURL(image);
    const format = getJsPdfImageType(image.type);
    const img = await loadImage(imageData);

    const imgWidth = img.width;
    const imgHeight = img.height;
    const imgRatio = imgWidth / imgHeight;
    const pageRatio = availableWidth / availableHeight;

    let finalWidth: number;
    let finalHeight: number;

    if (config.imageSize === "contain") {
      // Fit image within page while maintaining aspect ratio
      if (imgRatio > pageRatio) {
        finalWidth = availableWidth;
        finalHeight = availableWidth / imgRatio;
      } else {
        finalHeight = availableHeight;
        finalWidth = availableHeight * imgRatio;
      }
    } else {
      // Cover - fill the page, may crop
      if (imgRatio > pageRatio) {
        finalHeight = availableHeight;
        finalWidth = availableHeight * imgRatio;
      } else {
        finalWidth = availableWidth;
        finalHeight = availableWidth / imgRatio;
      }
    }

    // Center the image
    const x = margin + (availableWidth - finalWidth) / 2;
    const y = margin + (availableHeight - finalHeight) / 2;

    pdf.addImage(
      imageData,
      format,
      x,
      y,
      finalWidth,
      finalHeight
    );
  }

  pdf.save("images-to-pdf.pdf");
};

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const getJsPdfImageType = (mime: string): "JPEG" | "PNG" | "WEBP" => {
  const lower = mime.toLowerCase();
  if (lower.includes("png")) return "PNG";
  if (lower.includes("webp")) return "WEBP";
  return "JPEG";
};

