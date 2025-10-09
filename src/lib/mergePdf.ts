import { PDFDocument } from "pdf-lib";

export const mergePDFs = async (files: File[], outputName: string = "merged") => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([Uint8Array.from(mergedPdfBytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${outputName}.pdf`;
  link.click();

  URL.revokeObjectURL(url);
};
