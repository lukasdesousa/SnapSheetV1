import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, FileUp, ArrowLeft, X, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { mergePDFs } from "@/lib/mergePdf";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PdfFile {
  id: string;
  file: File;
}

function SortablePdfItem({ pdf, onRemove }: { pdf: PdfFile; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: pdf.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg group hover:border-primary/50 transition-all"
    >
      <div className="cursor-move" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{pdf.file.name}</p>
        <p className="text-xs text-muted-foreground">
          {(pdf.file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemove();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function MergePdf() {
  const [pdfFiles, setPdfFiles] = useState<PdfFile[]>([]);
  const [outputName, setOutputName] = useState("merged-document");
  const [isMerging, setIsMerging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => file.type === "application/pdf");

    if (validFiles.length !== files.length) {
      toast.error("Some files were skipped. Only PDF files are allowed.");
    }

    const newPdfFiles = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));

    setPdfFiles((prev) => [...prev, ...newPdfFiles]);
    if (validFiles.length > 0) {
      toast.success(`Added ${validFiles.length} PDF file(s)`);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPdfFiles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removePdf = (id: string) => {
    setPdfFiles((prev) => prev.filter((pdf) => pdf.id !== id));
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      toast.error("Please add at least 2 PDF files to merge");
      return;
    }

    setIsMerging(true);
    try {
      await mergePDFs(
        pdfFiles.map((p) => p.file),
        outputName
      );
      toast.success("PDFs merged successfully!");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast.error("Failed to merge PDFs");
    } finally {
      setIsMerging(false);
    }
  };

  const clearAll = () => {
    setPdfFiles([]);
    toast.success("All files cleared");
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

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Merge PDFs
            </h1>
            <p className="text-muted-foreground">
              Combine multiple PDF files into one document
            </p>
          </div>

          <Card className="p-8 bg-card border-border">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Add PDF Files
                </label>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <FileUp className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {pdfFiles.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      Files to merge ({pdfFiles.length})
                    </p>
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                      Clear all
                    </Button>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={pdfFiles.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {pdfFiles.map((pdf) => (
                          <SortablePdfItem key={pdf.id} pdf={pdf} onRemove={() => removePdf(pdf.id)} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Output filename
                    </label>
                    <Input
                      value={outputName}
                      onChange={(e) => setOutputName(e.target.value.replace(/[^a-z0-9-_]/gi, "-"))}
                      placeholder="merged-document"
                      className="bg-background border-input"
                    />
                  </div>

                  <Button
                    onClick={handleMerge}
                    disabled={pdfFiles.length < 2 || isMerging}
                    className="w-full bg-gradient-primary hover:opacity-90"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {isMerging ? "Merging..." : "Merge PDFs"}
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
