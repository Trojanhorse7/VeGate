import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { ConnectWallet } from '@/components/wallet/ConnectWallet';
import { Footer } from '@/components/layout/Footer';
import { VeChainProvider } from '@/components/providers/VeChainProvider';
import Link from 'next/link';
import Image from 'next/image';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'VeGate - Gasless Payments on VeChainThor',
  description: 'Instant QR-code payments with B3TR rewards',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className} style={{ fontWeight: 300 }}>
        <VeChainProvider>
          <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-10 h-10">
                    <Image
                      src="/vegate-logo.png"
                      alt="VeGate Logo"
                      width={40}
                      height={40}
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    VeGate
                  </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                  <Link
                    href="/"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/dashboard/create"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Create Bill
                  </Link>
                  <Link
                    href="/pay"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Scan QR
                  </Link>
                  <Link
                    href="/dashboard/history"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="https://www.npmjs.com/package/@trojan06/vegate-sdk"
                    target="_blank"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    SDK
                  </Link>
                </div>

                {/* Connect Wallet */}
                <div className="flex items-center gap-4">
                  <ConnectWallet />
                </div>
              </div>
            </div>
          </nav>
          {children}
          <Footer />
          <Toaster position="top-right" richColors />
        </VeChainProvider>
      </body>
    </html>
  );
}
