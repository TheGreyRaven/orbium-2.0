import SupabaseProvider from './supabase-provider';
import { Analytics } from '@vercel/analytics/react';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { PropsWithChildren } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from "@/utils/utils"
import "./globals.css";

const meta = {
  title: 'Orbium - Next-gen Software Licensing',
  description: 'Discover the ultimate solution for streamlined and secure software licensing with our cutting-edge SaaS platform. Elevate your development process effortlessly with our pre-made SDKs tailored for multiple programming languages. Experience unparalleled ease of use and robust protection for your intellectual property, ensuring seamless licensing integration for your software projects.',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: 'https://orbium.xyz/',
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  url: meta.url,
  type: meta.type,
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vercel',
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage
  }
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-black font-sans antialiased"
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <Navbar />
            <main>
              {children}
            </main>
            {/* <Footer /> */}
          </SupabaseProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
