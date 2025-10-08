import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, RotateCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  rotation: number;
}

interface SortableImageProps {
  item: ImageItem;
  onRemove: () => void;
  onRotate: () => void;
}

const SortableImage = ({ item, onRemove, onRotate }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg overflow-hidden bg-card border border-border hover:border-primary/50 transition-all"
    >
      <div 
        className="relative w-full h-40 cursor-move"
        {...attributes}
        {...listeners}
      >
        <img
          src={item.preview}
          alt={`Preview ${item.file.name}`}
          className="w-full h-full object-cover transition-transform pointer-events-none"
          style={{ transform: `rotate(${item.rotation}deg)` }}
          loading="lazy"
        />
      </div>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-background/90 hover:bg-background"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRotate();
          }}
        >
          <RotateCw className="w-4 h-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove();
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pointer-events-none"
      >
        <p className="text-xs text-white truncate">{item.file.name}</p>
      </div>
    </div>
  );
};

export const ImageUpload = ({ images, onImagesChange }: ImageUploadProps) => {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      
      const newItems = await Promise.all(
        imageFiles.map(async (file) => ({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: await convertToBase64(file),
          rotation: 0,
        }))
      );
      
      const updatedItems = [...imageItems, ...newItems];
      setImageItems(updatedItems);
      onImagesChange(updatedItems.map(item => item.file));
    },
    [imageItems, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
  });

  const removeImage = (id: string) => {
    const updatedItems = imageItems.filter(item => item.id !== id);
    setImageItems(updatedItems);
    onImagesChange(updatedItems.map(item => item.file));
  };

  const rotateImage = (id: string) => {
    const updatedItems = imageItems.map(item =>
      item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
    );
    setImageItems(updatedItems);
  };

  const clearAllImages = () => {
    setImageItems([]);
    onImagesChange([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imageItems.findIndex(item => item.id === active.id);
      const newIndex = imageItems.findIndex(item => item.id === over.id);
      
      const reorderedItems = arrayMove(imageItems, oldIndex, newIndex);
      setImageItems(reorderedItems);
      onImagesChange(reorderedItems.map(item => item.file));
    }
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

      {imageItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Arraste para reordenar • {imageItems.length} {imageItems.length === 1 ? "imagem" : "imagens"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllImages}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Limpar tudo
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={imageItems.map(item => item.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageItems.map((item) => (
                  <SortableImage
                    key={item.id}
                    item={item}
                    onRemove={() => removeImage(item.id)}
                    onRotate={() => rotateImage(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

    </div>
  );
};
