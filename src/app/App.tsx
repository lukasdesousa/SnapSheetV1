import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/providers/Providers";
import Index from "./page";
import NotFound from "./not-found";

function App() {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </Providers>
  );
}

export default App;
