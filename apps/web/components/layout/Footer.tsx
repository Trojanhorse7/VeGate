'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, MessageCircle, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/vegate-logo.png"
                  alt="VeGate Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VeGate
              </span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Experience the next generation of payments with zero gas fees,
              instant QR codes, and B3TR rewards on VeChainThor.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/your-org/vegate"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Github className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://twitter.com/vegate"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="w-5 h-5 text-primary" />
              </a>
              <a
                href="https://discord.gg/vegate"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-primary" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/create"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Create Bill
                </Link>
              </li>
              <li>
                <Link
                  href="/pay"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Scan QR
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/history"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Developers</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/your-org/vegate/tree/main/packages/sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  SDK
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/your-org/vegate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://docs.vechain.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  VeChain Docs
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.vebetterdao.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  VeBetterDAO
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://explore-testnet.vechain.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Explorer
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VeGate. Built on VeChainThor. All
              rights reserved.
            </p>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                VeChain Testnet
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
