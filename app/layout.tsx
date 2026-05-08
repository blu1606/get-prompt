import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/nav';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Get Prompt — 725 Curated AI Image Prompts',
  description: 'A premium gallery of 725 curated AI image generation prompts. Browse, preview, and copy prompts with one click.',
  openGraph: {
    title: 'Get Prompt',
    description: '725 curated AI image prompts',
    type: 'website',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning className="bg-canvas selection:bg-primary-blue/30">
        <Nav />
        {children}
      </body>
    </html>
  );
}
