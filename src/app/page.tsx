import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FileImage, FileText, Merge, Shrink } from "lucide-react";

const tools = [
  {
    name: "Images to PDF",
    description: "Convert multiple images into a single PDF with custom settings",
    icon: FileText,
    path: "/images-to-pdf",
    gradient: "from-primary to-accent",
  },
  {
    name: "PDF to Images",
    description: "Extract all pages from a PDF as individual images",
    icon: FileImage,
    path: "/pdf-to-images",
    gradient: "from-accent to-primary-glow",
  },
  {
    name: "Merge PDFs",
    description: "Combine multiple PDF files into one document",
    icon: Merge,
    path: "/merge-pdf",
    gradient: "from-primary-glow to-primary",
  },
  {
    name: "Compress Images",
    description: "Reduce image file sizes while maintaining quality",
    icon: Shrink,
    path: "/compress-images",
    gradient: "from-accent to-destructive",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SnapSheet
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional tools for PDF and image conversion. Fast, free, and easy to use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tools.map((tool) => (
            <Link key={tool.path} href={tool.path}>
              <Card className="group relative overflow-hidden p-8 h-full hover:shadow-glow transition-all duration-300 cursor-pointer border-border hover:border-primary/50 bg-card">
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10 space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <tool.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            All tools work directly in your browser. No uploads to servers, your files stay private.
          </p>
        </div>
      </div>
    </div>
  );
}
