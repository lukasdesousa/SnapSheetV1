import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Download, FileUp, ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { compressImage } from "@/lib/compressImage";

interface CompressedImage {
  id: string;
  original: File;
  compressed: Blob;
  originalSize: number;
  compressedSize: number;
  preview: string;
}

export default function CompressImages() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      toast.error("Some files were skipped. Only image files are allowed.");
    }

    if (imageFiles.length === 0) return;

    setIsCompressing(true);
    try {
      const compressed = await Promise.all(
        imageFiles.map(async (file) => {
          const compressedBlob = await compressImage(file, quality, maxWidth);
          const preview = URL.createObjectURL(compressedBlob);
          return {
            id: crypto.randomUUID(),
            original: file,
            compressed: compressedBlob,
            originalSize: file.size,
            compressedSize: compressedBlob.size,
            preview,
          };
        })
      );

      setImages((prev) => [...prev, ...compressed]);
      toast.success(`Compressed ${compressed.length} image(s)`);
    } catch (error) {
      console.error("Error compressing images:", error);
      toast.error("Failed to compress some images");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = (image: CompressedImage) => {
    const url = URL.createObjectURL(image.compressed);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${image.original.name}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    images.forEach((image, index) => {
      setTimeout(() => {
        handleDownload(image);
      }, index * 200);
    });
    toast.success("Downloading all images...");
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) URL.revokeObjectURL(image.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    toast.success("All images cleared");
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const getReduction = (image: CompressedImage) => {
    const reduction = ((image.originalSize - image.compressedSize) / image.originalSize) * 100;
    return reduction.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Compress Images
            </h1>
            <p className="text-muted-foreground">
              Reduce image file sizes while maintaining quality
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 p-6 bg-card border-border h-fit">
              <div className="space-y-6">
                <div>
                  <Label className="text-foreground">Quality</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[quality * 100]}
                      onValueChange={([v]) => setQuality(v / 100)}
                      min={10}
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-foreground w-12 text-right">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                </div>

                <div>
                  <Label className="text-foreground">Max Width (px)</Label>
                  <Input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Number(e.target.value))}
                    min={100}
                    max={4096}
                    className="mt-2 bg-background border-input"
                  />
                </div>

                <div>
                  <Label className="text-foreground mb-2 block">Add Images</Label>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      disabled={isCompressing}
                      className="cursor-pointer file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <FileUp className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {images.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-foreground">
                      Compressed Images ({images.length})
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={clearAll}>
                        Clear all
                      </Button>
                      <Button
                        onClick={handleDownloadAll}
                        variant="outline"
                        size="sm"
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download All
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((image) => (
                      <Card
                        key={image.id}
                        className="overflow-hidden group bg-card border-border hover:border-primary/50 transition-all"
                      >
                        <div className="relative">
                          <img
                            src={image.preview}
                            alt={image.original.name}
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(image.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/90 hover:bg-destructive text-destructive-foreground"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4 space-y-3">
                          <p className="text-sm font-medium text-foreground truncate">
                            {image.original.name}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatSize(image.originalSize)}</span>
                            <span className="text-accent font-semibold">
                              {getReduction(image)}% smaller
                            </span>
                            <span>{formatSize(image.compressedSize)}</span>
                          </div>
                          <Button
                            onClick={() => handleDownload(image)}
                            size="sm"
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {images.length === 0 && (
                <Card className="p-12 bg-card border-border border-dashed">
                  <div className="text-center text-muted-foreground">
                    <FileUp className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No images compressed yet</p>
                    <p className="text-sm mt-1">
                      Upload images using the panel on the left
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
