import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/vegate-logo.png"
            alt="VeGate Logo"
            width={80}
            height={80}
            unoptimized
          />
        </div>

        {/* 404 Error */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-accent">404</h1>
          <h2 className="text-3xl font-semibold">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard/create"
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent/10 transition-colors"
          >
            Create Bill
          </Link>
        </div>
      </div>
    </div>
  );
}
