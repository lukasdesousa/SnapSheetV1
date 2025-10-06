import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export const ImageUpload = ({ images, onImagesChange }: ImageUploadProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Cria e gerencia URLs de preview
  useEffect(() => {
    // Revoga URLs antigas
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // Cria novas URLs
    const newUrls = images.map(file => URL.createObjectURL(file));
    setPreviewUrls(newUrls);

    // Cleanup: revoga URLs quando componente desmonta ou imagens mudam
    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      onImagesChange([...images, ...imageFiles]);
    },
    [images, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300
          ${
            isDragActive
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-card/50"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-2">
          {isDragActive
            ? "Solte as imagens aqui..."
            : "Arraste imagens ou clique para selecionar"}
        </p>
        <p className="text-sm text-muted-foreground">
          Suporta PNG, JPG, JPEG, GIF, WEBP
        </p>
      </div>

      {images.length > 0 && previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image.name}-${index}`}
              className="relative group rounded-lg overflow-hidden bg-card border border-border"
            >
              <img
                src={previewUrls[index]}
                alt={`Preview ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-xs text-white truncate">{image.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
