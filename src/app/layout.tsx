// app/layout.tsx
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import { Providers } from "@/providers/Providers";
import { Analytics } from "@vercel/analytics/next"
import "./index.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: "Images to PDF",
  description:
    "SnapSheet é o web app rápido e gratuito que permite converter imagens para PDF com qualidade, sem instalação e totalmente online.",
  keywords:
    "SnapSheet, converter imagens para PDF, imagens para PDF online, ferramenta PDF, conversão de imagens, app online, PDF grátis, images to pdf, free image conversor, free image to pdf, image pdf",
  authors: [{ name: "SnapSheet", url: "https://snapsheet.space/" }],
  robots: "index, follow",
  openGraph: {
    title: "Image to PDF",
    description:
      "SnapSheet é o web app rápido e gratuito que permite converter imagens para PDF com qualidade, sem instalação e totalmente online.",
    url: "https://snapsheet.space/",
    siteName: "SnapSheet",
    images: [
      {
        url: "https://snapsheet.space/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Image to PDF",
      },
    ],
    locale: "pt_BR",
    type: "website",
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
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        <meta name="google-adsense-account" content="ca-pub-3912537462625302" />
        <meta name="monetag" content="9f1799908549d5c6e6c48dd5b9b8c46f" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3912537462625302"
          crossOrigin="anonymous"></script>
          
        <script src="https://staupsoaksy.net/act/files/tag.min.js?z=10007237" data-cfasync="false" async></script>
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(s){s.dataset.zone='10007297';s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))"
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: "(function(){var s = document.createElement('script'); s.dataset.zone = '10007307'; s.src = 'https://groleegni.net/vignette.min.js'; ([document.documentElement, document.body].filter(Boolean).pop().appendChild(s)); })();"
          }}
        />
        

        {metadata.openGraph.images.map((img, i) => (
          <meta property="og:image" key={i} content={img.url} />
        ))}

        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
