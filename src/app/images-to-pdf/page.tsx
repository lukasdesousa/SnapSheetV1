import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { PdfSettings, PdfConfig } from "@/components/PdfSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, ImageIcon, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { generatePDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";
import { sendSimpleNotification } from "@/lib/sendEmail";

const Index = () => {
  const [images, setImages] = useState<File[]>([]);
  const [pdfName, setPdfName] = useState("images-to-pdf");
  const [config, setConfig] = useState<PdfConfig>({
    pageSize: "a4",
    orientation: "portrait",
    margin: 10,
    spacing: 5,
    imageSize: "contain",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (images.length === 0) {
      toast.error("Adicione pelo menos uma imagem");
      return;
    }

    setIsGenerating(true);
    try {
      await generatePDF(images, config, pdfName);
      toast.success("PDF gerado com sucesso!");
      await sendSimpleNotification();
    } catch (error) {
      toast.error("Erro ao gerar PDF");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Button>
        </Link>
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 shadow-glow">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            SnapSheet
          </h1>
          <p className="text-muted-foreground text-lg">
            Converta suas imagens em PDF com estilo personalizado
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ImageUpload images={images} onImagesChange={setImages} />
          </div>

          <div className="space-y-6">
            <PdfSettings config={config} onConfigChange={setConfig} />

            <div className="space-y-2">
              <Label htmlFor="pdf-name">Nome do arquivo PDF</Label>
              <Input
                id="pdf-name"
                type="text"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                placeholder="nome-do-arquivo"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Apenas letras, números, hífens e underscores
              </p>
            </div>

            <Button
              onClick={handleGeneratePDF}
              disabled={images.length === 0 || isGenerating}
              className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
              size="lg"
            >
              <FileDown className="w-5 h-5 mr-2" />
              {isGenerating ? "Gerando..." : "Gerar PDF"}
            </Button>

            {images.length > 0 && (
              <div className="text-center text-sm text-muted-foreground">
                {images.length} {images.length === 1 ? "imagem" : "imagens"}{" "}
                selecionada{images.length === 1 ? "" : "s"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
