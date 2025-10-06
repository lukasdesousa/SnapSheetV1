import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

export interface PdfConfig {
  pageSize: "a4" | "letter";
  orientation: "portrait" | "landscape";
  margin: number;
  spacing: number;
  imageSize: "contain" | "cover";
}

interface PdfSettingsProps {
  config: PdfConfig;
  onConfigChange: (config: PdfConfig) => void;
}

export const PdfSettings = ({ config, onConfigChange }: PdfSettingsProps) => {
  return (
    <Card className="p-6 space-y-6 bg-gradient-card border-border">
      <div>
        <h3 className="text-lg font-semibold mb-4">Configurações do PDF</h3>
      </div>

      <div className="space-y-2">
        <Label>Tamanho da Página</Label>
        <RadioGroup
          value={config.pageSize}
          onValueChange={(value) =>
            onConfigChange({ ...config, pageSize: value as "a4" | "letter" })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="a4" id="a4" />
            <Label htmlFor="a4" className="font-normal cursor-pointer">
              A4 (210 × 297 mm)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="letter" id="letter" />
            <Label htmlFor="letter" className="font-normal cursor-pointer">
              Letter (216 × 279 mm)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Orientação</Label>
        <RadioGroup
          value={config.orientation}
          onValueChange={(value) =>
            onConfigChange({
              ...config,
              orientation: value as "portrait" | "landscape",
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="portrait" id="portrait" />
            <Label htmlFor="portrait" className="font-normal cursor-pointer">
              Retrato
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="landscape" id="landscape" />
            <Label htmlFor="landscape" className="font-normal cursor-pointer">
              Paisagem
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Ajuste da Imagem</Label>
        <RadioGroup
          value={config.imageSize}
          onValueChange={(value) =>
            onConfigChange({
              ...config,
              imageSize: value as "contain" | "cover",
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="contain" id="contain" />
            <Label htmlFor="contain" className="font-normal cursor-pointer">
              Ajustar (manter proporção)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cover" id="cover" />
            <Label htmlFor="cover" className="font-normal cursor-pointer">
              Preencher (cortar se necessário)
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Margem</Label>
          <span className="text-sm text-muted-foreground">{config.margin}mm</span>
        </div>
        <Slider
          value={[config.margin]}
          onValueChange={([value]) =>
            onConfigChange({ ...config, margin: value })
          }
          min={5}
          max={30}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Espaçamento entre Imagens</Label>
          <span className="text-sm text-muted-foreground">{config.spacing}mm</span>
        </div>
        <Slider
          value={[config.spacing]}
          onValueChange={([value]) =>
            onConfigChange({ ...config, spacing: value })
          }
          min={0}
          max={20}
          step={1}
          className="w-full"
        />
      </div>
    </Card>
  );
};
