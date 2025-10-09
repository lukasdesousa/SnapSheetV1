'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, FileUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ExtractedImage {
  dataUrl: string;
  pageNumber: number;
}

export default function PdfToImages() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setExtractedImages([]);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleExtract = async () => {
    if (!pdfFile) {
      toast.error("Please select a PDF file first");
      return;
    }

    setIsExtracting(true);
    try {
      const { extractImagesFromPDF } = await import("@/lib/pdfToImages");
      const images = await extractImagesFromPDF(pdfFile);
      setExtractedImages(images);
      toast.success(`Extracted ${images.length} pages successfully!`);
    } catch (error) {
      console.error("Error extracting images:", error);
      toast.error("Failed to extract images from PDF");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDownload = (image: ExtractedImage) => {
    const link = document.createElement("a");
    link.href = image.dataUrl;
    link.download = `page-${image.pageNumber}.png`;
    link.click();
  };

  const handleDownloadAll = () => {
    extractedImages.forEach((image, index) => {
      setTimeout(() => {
        handleDownload(image);
      }, index * 200);
    });
    toast.success("Downloading all images...");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PDF to Images
            </h1>
            <p className="text-muted-foreground">
              Extract all pages from your PDF as high-quality images
            </p>
          </div>

          <Card className="p-8 bg-card border-border">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Select PDF File
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <FileUp className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
                {pdfFile && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {pdfFile.name}
                  </p>
                )}
              </div>

              <Button
                onClick={handleExtract}
                disabled={!pdfFile || isExtracting}
                className="w-full bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                {isExtracting ? "Extracting..." : "Extract Images"}
              </Button>
            </div>
          </Card>

          {extractedImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">
                  Extracted Images ({extractedImages.length})
                </h2>
                <Button
                  onClick={handleDownloadAll}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {extractedImages.map((image) => (
                  <Card
                    key={image.pageNumber}
                    className="overflow-hidden group bg-card border-border hover:border-primary/50 transition-all"
                  >
                    <div className="relative">
                      <img
                        src={image.dataUrl}
                        alt={`Page ${image.pageNumber}`}
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          onClick={() => handleDownload(image)}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-card">
                      <p className="text-sm text-muted-foreground text-center">
                        Page {image.pageNumber}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
