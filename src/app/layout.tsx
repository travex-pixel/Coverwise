import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://coverwise.vercel.app",
  ),
  title: {
    default: "Coverwise — Stop shopping around for insurance",
    template: "%s · Coverwise",
  },
  description:
    "Tell us about your car once. Coverwise helps you compare available comprehensive car insurance options from participating providers in one place.",
  applicationName: "Coverwise",
  keywords: [
    "car insurance comparison",
    "comprehensive car insurance",
    "Australia",
    "compare insurance",
  ],
  openGraph: {
    title: "Coverwise — Stop shopping around for insurance",
    description:
      "One application. Multiple insurers. A clearer view of your options.",
    type: "website",
    locale: "en_AU",
    siteName: "Coverwise",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F5F3ED",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
