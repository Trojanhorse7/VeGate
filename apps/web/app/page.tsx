'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  QrCode,
  Zap,
  Gift,
  Shield,
  ArrowRight,
  Sparkles,
  Wallet,
  Check,
  Smartphone,
  Gauge,
  BookOpen,
  Code,
  ExternalLink,
  Users,
  Award,
  Scan,
  Camera,
  Link2,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse"></div>
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: '0.5s' }}
              ></div>
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-2xl ring-4 ring-primary/10">
                <Image
                  src="/vegate-logo.png"
                  alt="VeGate Logo"
                  width={112}
                  height={112}
                  className="w-28 h-28 object-contain"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-12 space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent animate-gradient">
                VeGate
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground/90">
                Seamless Payments on VeChainThor
              </span>
            </h1>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-1 max-w-20"></div>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm font-semibold border-primary/30 bg-primary/5"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Powered by VeChainThor
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm font-semibold border-accent/30 bg-accent/5"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Earn B3TR Rewards
                </Badge>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent flex-1 max-w-20"></div>
            </div>

            <p className="text-xl sm:text-2xl xl:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 font-light">
              Experience the{' '}
              <span className="font-semibold text-primary">
                next generation
              </span>{' '}
              of payments with{' '}
              <span className="font-semibold text-primary">minimal fees</span>,
              instant{' '}
              <span className="font-semibold text-primary">
                QR code payments
              </span>
              , and{' '}
              <span className="font-semibold text-rewards">B3TR rewards</span>
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 px-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-accent" />
                </div>
                <span>Instant QR Payments</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="w-8 h-8 rounded-full bg-rewards/10 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-rewards" />
                </div>
                <span>1-2 B3TR per Transaction</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 px-4">
            <Link href="/dashboard/create">
              <Button
                size="lg"
                className="group h-16 px-10 text-lg font-semibold shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                <QrCode className="mr-2 h-6 w-6" />
                Create Your First Bill
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard/history">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 text-lg font-semibold border-2 hover:bg-primary/5"
              >
                <Wallet className="mr-2 h-6 w-6" />
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Users className="h-5 w-5" />
              <span>
                Join{' '}
                <span className="font-bold text-primary text-lg">1000+</span>{' '}
                users who trust VeGate
              </span>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="glass px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Smart Contract Verified
              </div>
              <div className="glass px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                VeBetterDAO Integrated
              </div>
              <div className="glass px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                Open Source
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center p-6 card-hover border-2">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-primary mb-2">0 $</div>
                <div className="text-sm text-muted-foreground font-medium">
                  Gas Fees
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Complete zero-cost transactions
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 card-hover border-2">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-primary mb-2">
                  &lt;1s
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Second Transactions
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Lightning-fast processing
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 card-hover border-2">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground font-medium">
                  Success Rate
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Guaranteed transaction success
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 card-hover border-2">
              <CardContent className="p-0">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground font-medium">
                  Availability
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Always ready when you need it
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose VeGate Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Award className="h-4 w-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VeGate
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of payments with cutting-edge
              blockchain technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 card-hover border-2 hover:border-primary/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Minimal Fees</h3>
              <p className="text-muted-foreground mb-6">
                Pay only ~0.02 VET (~$0.0002) per transaction on VeChainThor's
                efficient blockchain
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Extremely low costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Instant payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>User-friendly</span>
                </li>
              </ul>
              <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>

            <Card className="p-8 card-hover border-2 hover:border-primary/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-6">
                <QrCode className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">QR Code Payments</h3>
              <p className="text-muted-foreground mb-6">
                Share payment links via QR codes for instant mobile-friendly
                payments
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Mobile optimized</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Easy sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Universal access</span>
                </li>
              </ul>
              <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>

            <Card className="p-8 card-hover border-2 hover:border-primary/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Secure & Fast</h3>
              <p className="text-muted-foreground mb-6">
                Built on VeChainThor with instant confirmations and
                enterprise-grade security
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Bank-level security</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Instant confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Reliable network</span>
                </li>
              </ul>
              <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Gauge className="h-4 w-4 mr-2" />
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple as 1-2-3. Get started with VeGate in just three simple
              steps. No complex setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="relative p-8 card-hover border-2">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mt-4">
                <QrCode className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Bill</h3>
              <p className="text-muted-foreground">
                Set amount, token, and recipient address to generate a payment
                request
              </p>
            </Card>

            <Card className="relative p-8 card-hover border-2">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-6 mt-4">
                <Smartphone className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Share QR Code</h3>
              <p className="text-muted-foreground mb-4">
                Share the generated QR code or payment link with the payer
              </p>
              <p className="text-sm text-muted-foreground">
                Recipients can scan the QR code with any device or use the
                shareable payment link
              </p>
            </Card>

            <Card className="relative p-8 card-hover border-2">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6 mt-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Payment</h3>
              <p className="text-muted-foreground">
                Payer scans QR and pays instantly with minimal transaction fees
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/dashboard/create">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-semibold shadow-xl"
              >
                Ready to start? Create your first bill now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scan QR Code Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-4" variant="outline">
              <Scan className="h-4 w-4 mr-2" />
              Easy Payment
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Scan QR Code to Pay
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No app download required. Simply scan the QR code or enter the
              payment link manually.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* QR Code Scanner Card */}
            <Card className="p-6 glass card-hover border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">QR Code Scanner</h3>
                  <p className="text-sm text-muted-foreground">
                    Scan with your camera
                  </p>
                </div>
              </div>

              {/* Mock QR Scanner Display */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-8 mb-6 min-h-[300px] flex items-center justify-center border-2 border-dashed border-primary/20">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse"></div>
                    <div className="relative w-48 h-48 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-xl flex items-center justify-center shadow-2xl">
                      <QrCode className="w-32 h-32 text-white dark:text-gray-900" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Camera className="w-5 h-5 animate-pulse" />
                    <p className="text-sm font-medium">
                      Point camera at QR code
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Compatible with any smartphone camera
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Instant payment details recognition
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Secure encrypted transactions
                  </span>
                </div>
              </div>
            </Card>

            {/* Manual Link Entry Card */}
            <Card className="p-6 glass card-hover border-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Link2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Manual URL Entry</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste payment link
                  </p>
                </div>
              </div>

              {/* Manual Entry Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="https://vegate.app/pay/0x..."
                      className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-background font-mono text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      disabled
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Link2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Paste a VeGate payment URL to access the payment page
                    directly
                  </p>
                </div>

                <Button className="w-full h-12" size="lg" disabled>
                  <Search className="h-4 w-4 mr-2" />
                  Open Payment Link
                </Button>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Direct link access without scanning
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Copy-paste from messages or emails
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Perfect for desktop payments
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/dashboard/create">
              <Button size="lg" className="h-14 px-8 shadow-xl">
                <QrCode className="mr-2 h-5 w-5" />
                Create Your First Payment QR
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SDK & Documentation Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="outline">
              <Code className="h-4 w-4 mr-2" />
              For Developers
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Build with VeGate
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Integrate VeGate into your applications with our comprehensive SDK
              and documentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 card-hover border-2 hover:border-primary/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">VeGate SDK</h3>
              <p className="text-muted-foreground mb-6">
                Full-featured TypeScript SDK for seamless integration with
                VeGate payment system
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>TypeScript support with full type definitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>VeChain wallet integration (VeWorld, Sync2)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>QR code generation and payment processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>VeBetterDAO rewards integration</span>
                </li>
              </ul>
              <div className="flex gap-3">
                <a
                  href="https://github.com/your-org/vegate/tree/main/packages/sdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                >
                  <Code className="mr-2 h-4 w-4" />
                  View SDK
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>

            <Card className="p-8 card-hover border-2 hover:border-primary/50 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-6">
                <BookOpen className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Documentation</h3>
              <p className="text-muted-foreground mb-6">
                Comprehensive guides, API references, and examples to help you
                get started quickly
              </p>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Getting started guides and tutorials</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Complete API reference documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Code examples and best practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Smart contract documentation</span>
                </li>
              </ul>
              <div className="flex gap-3">
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-transparent hover:bg-gray-100 h-10 px-4 py-2"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Docs
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-2">
              <h3 className="text-2xl font-bold mb-4">Quick Start Example</h3>
              <div className="bg-muted/50 rounded-lg p-6 text-left">
                <code className="text-sm">
                  <div className="text-muted-foreground">
                    {/* Install the SDK */}
                  </div>
                  <div className="text-primary font-mono">
                    npm install @vegate/sdk
                  </div>
                  <br />
                  <div className="text-muted-foreground">
                    {/* Create a payment */}
                  </div>
                  <div className="text-foreground font-mono">
                    <span className="text-purple-600">import</span> {'{'} VeGate{' '}
                    {'}'} <span className="text-purple-600">from</span>{' '}
                    <span className="text-green-600">'@vegate/sdk'</span>;
                  </div>
                  <div className="text-foreground font-mono">
                    <span className="text-purple-600">const</span> veGate ={' '}
                    <span className="text-purple-600">new</span> VeGate();
                  </div>
                  <div className="text-foreground font-mono">
                    <span className="text-purple-600">const</span> bill ={' '}
                    <span className="text-purple-600">await</span>{' '}
                    veGate.createBill(amount, token);
                  </div>
                </code>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-8">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Payments?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the revolution of blockchain payments and experience the future
            today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/dashboard/create">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <QrCode className="mr-2 h-5 w-5" />
                Create Your First Bill
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            <span className="font-bold text-primary">1000+</span> users trust
            VeGate
          </p>
        </div>
      </section>
    </div>
  );
}
