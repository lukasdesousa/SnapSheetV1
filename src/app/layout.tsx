// app/layout.tsx
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "./index.css";

// Configuração da fonte Poppins
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: "SnapSheet - Converta suas imagens em PDF online",
  description:
    "SnapSheet é o web app rápido e gratuito que permite converter imagens para PDF com qualidade, sem instalação e totalmente online.",
  keywords:
    "SnapSheet, converter imagens para PDF, imagens para PDF online, ferramenta PDF, conversão de imagens, app online, PDF grátis",
  authors: [{ name: "SnapSheet", url: "https://www.snap-sheet.com" }],
  robots: "index, follow",
  openGraph: {
    title: "SnapSheet - Converta suas imagens em PDF online",
    description:
      "SnapSheet é o web app rápido e gratuito que permite converter imagens para PDF com qualidade, sem instalação e totalmente online.",
    url: "https://www.snap-sheet.com",
    siteName: "SnapSheet",
    images: [
      {
        url: "https://www.snap-sheet.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "SnapSheet - Imagens para PDF",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapSheet - Converta imagens para PDF",
    description:
      "SnapSheet é rápido, gratuito e online: converta imagens para PDF em segundos.",
    site: "@SnapSheetApp",
    creator: "@SnapSheetApp",
    images: ["https://www.snap-sheet.com/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.className}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="robots" content={metadata.robots} />

        {/* Open Graph */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        {metadata.openGraph.images.map((img, i) => (
          <meta property="og:image" key={i} content={img.url} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:site" content={metadata.twitter.site} />
        <meta name="twitter:creator" content={metadata.twitter.creator} />
        {metadata.twitter.images.map((img, i) => (
          <meta name="twitter:image" key={i} content={img} />
        ))}

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
