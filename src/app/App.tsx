import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/providers/Providers";
import Home from "./page";
import ImagesToPdf from "./images-to-pdf/page";
import PdfToImages from "./pdf-to-images/page";
import MergePdf from "./merge-pdf/page";
import CompressImages from "./compress-images/page";
import NotFound from "./not-found";

function App() {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/images-to-pdf" element={<ImagesToPdf />} />
          <Route path="/pdf-to-images" element={<PdfToImages />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/compress-images" element={<CompressImages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </Providers>
  );
}

export default App;
