import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export const ImageUpload = ({ images, onImagesChange }: ImageUploadProps) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Converte File para base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith("image/")
      );
      
      // Converte novas imagens para base64
      const newBase64Previews = await Promise.all(
        imageFiles.map(file => convertToBase64(file))
      );
      
      // Atualiza os arrays de imagens e previews
      onImagesChange([...images, ...imageFiles]);
      setPreviewUrls([...previewUrls, ...newBase64Previews]);
    },
    [images, previewUrls, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setPreviewUrls(newPreviews);
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

      {images.length > 0 && previewUrls.length === images.length && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={`${image.name}-${index}`}
              className="relative group rounded-lg overflow-hidden bg-card border border-border"
            >
              <img
                src={previewUrls[index]}
                alt={`Pré-visualização da imagem ${index + 1}`}
                className="w-full h-40 object-cover"
                loading="lazy"
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
