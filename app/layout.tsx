import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./editorial.css";
import { StoreProvider } from "./components/store-provider";
import { MobileNav, SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";

async function requestOrigin() {
  const requestHeaders = await headers();
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const configuredUrl = configured ? new URL(configured) : null;
  const host = (requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? configuredUrl?.host ?? "localhost:3000").split(",")[0].trim();
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0].trim();
  const protocol = forwardedProtocol ?? (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return new URL(`${protocol}://${host}`);
}

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = await requestOrigin();
  const title = "EGO Beauty — профессиональные материалы для маникюра";
  const description = "Гели, гель-лаки и жидкие полигели EGO Beauty для моделирования, укрепления и nail-дизайна.";
  return {
    metadataBase,
    title: { default: title, template: "%s — EGO Beauty" },
    description,
    applicationName: "EGO Beauty",
    keywords: ["EGO Beauty", "гель для наращивания", "гель-лак", "жидкий полигель", "маникюр"],
    icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: { type: "website", locale: "ru_RU", siteName: "EGO Beauty", title, description, url: "/", images: [{ url: "/og.png", width: 1200, height: 630, alt: "EGO Beauty — профессиональные материалы для маникюра" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f3f0eb", viewportFit: "cover" };

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EGO Beauty",
  description: "Профессиональный бренд материалов для маникюра и моделирования ногтей.",
  sameAs: ["https://t.me/egobeauty_professional", "https://www.wildberries.ru/brands/ego-beauty"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <a className="skip-link" href="#main-content">К основному содержанию</a>
        <StoreProvider>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <MobileNav />
        </StoreProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
