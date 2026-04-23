import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import { UiVisibilityWrapper } from "@/components/UiVisibilityWrapper";
import { WhatsappFAB } from "@/components/WhatsappFAB";
import { Providers } from "@/context/Providers";
import { nunitoSansFont, robotoFont } from "@/lib/fonts";
import {
  getActiveSections,
  getInitialDataDesarrollos,
  getWebsiteMedia,
} from "@/utils/api";
import { GLOBAL } from "@/utils/metaTags";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
// import { ChatWidget } from "@/components/ChatWidget";
import { GoogleTagManager } from "@next/third-parties/google";

export const metadata: Metadata = GLOBAL;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sectionsData, mediaData, initialDesarrollos] = await Promise.all([
    getActiveSections(),
    getWebsiteMedia(),
    getInitialDataDesarrollos(),
  ]);

  return (
    <html lang="es">
      <body className={`${robotoFont.variable} ${nunitoSansFont.variable} `}>
        <Providers>
          <UiVisibilityWrapper>
            <WhatsappFAB />
            <TopBar
              initialData={sectionsData.navbar}
              initialDesarrollos={initialDesarrollos}
            />
          </UiVisibilityWrapper>

          <main className="app-container">
            {children}

            <ToastContainer
              position="bottom-left"
              theme="light"
              progressClassName="bg-[#cd1019]"
            />
          </main>

          <UiVisibilityWrapper>
            <Footer
            // initialData={sectionsData?.footer ?? initialFooterSections}
            />
          </UiVisibilityWrapper>

          {/* <ChatWidget /> */}
        </Providers>
      </body>

      <GoogleTagManager gtmId="GTM-NX53S2WR" />
    </html>
  );
}
