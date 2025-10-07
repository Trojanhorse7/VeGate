import QRCode from "qrcode";

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

export interface BrandedQROptions extends QRCodeOptions {
  logo?: string; // Logo URL or base64
  logoSize?: number; // Logo size as percentage of QR code
  backgroundColor?: string;
  foregroundColor?: string;
  brandName?: string;
}

/**
 * Get payment URL for a bill
 */
export function getPaymentUrl(
  billId: string,
  baseUrl: string = "https://vegate.app"
): string {
  return `${baseUrl}/pay/${billId}`;
}

/**
 * Generate standard QR code
 */
export async function generateQR(
  billId: string,
  baseUrl?: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const paymentUrl = getPaymentUrl(billId, baseUrl);
  
  const qrOptions = {
    width: options.size || 512,
    margin: options.margin || 2,
    errorCorrectionLevel: options.errorCorrectionLevel || "M",
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  };

  try {
    const qrDataUrl = await QRCode.toDataURL(paymentUrl, qrOptions);
    return qrDataUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`);
  }
}

/**
 * Generate branded QR code with logo and custom styling
 */
export async function generateBrandedQR(
  billId: string,
  options: BrandedQROptions,
  baseUrl?: string
): Promise<string> {
  const paymentUrl = getPaymentUrl(billId, baseUrl);
  
  const qrOptions = {
    width: options.size || 512,
    margin: options.margin || 2,
    errorCorrectionLevel: options.errorCorrectionLevel || "H", // Higher for logo overlay
    color: {
      dark: options.foregroundColor || "#000000",
      light: options.backgroundColor || "#FFFFFF",
    },
  };

  try {
    // Generate base QR code
    const qrDataUrl = await QRCode.toDataURL(paymentUrl, qrOptions);
    
    // If no logo, return standard QR
    if (!options.logo) {
      return qrDataUrl;
    }

    // Create canvas for logo overlay
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    const qrSize = options.size || 512;
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Draw QR code
    const qrImage = new Image();
    await new Promise((resolve, reject) => {
      qrImage.onload = resolve;
      qrImage.onerror = reject;
      qrImage.src = qrDataUrl;
    });
    ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

    // Draw logo in center
    const logoSize = (qrSize * (options.logoSize || 20)) / 100;
    const logoX = (qrSize - logoSize) / 2;
    const logoY = (qrSize - logoSize) / 2;

    // White background for logo
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(logoX - 10, logoY - 10, logoSize + 20, logoSize + 20);

    // Draw logo
    const logoImage = new Image();
    await new Promise((resolve, reject) => {
      logoImage.onload = resolve;
      logoImage.onerror = reject;
      logoImage.src = options.logo!;
    });
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

    // Add brand name if provided
    if (options.brandName) {
      ctx.fillStyle = options.foregroundColor || "#000000";
      ctx.font = `bold ${qrSize / 20}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(options.brandName, qrSize / 2, qrSize - 20);
    }

    return canvas.toDataURL("image/png");
  } catch (error) {
    throw new Error(`Failed to generate branded QR code: ${error}`);
  }
}

/**
 * Generate QR code as SVG
 */
export async function generateQRSVG(
  billId: string,
  baseUrl?: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const paymentUrl = getPaymentUrl(billId, baseUrl);
  
  const qrOptions = {
    width: options.size || 512,
    margin: options.margin || 2,
    errorCorrectionLevel: options.errorCorrectionLevel || "M",
    type: "svg" as const,
  };

  try {
    const svg = await QRCode.toString(paymentUrl, qrOptions);
    return svg;
  } catch (error) {
    throw new Error(`Failed to generate SVG QR code: ${error}`);
  }
}

/**
 * Download QR code as image
 */
export function downloadQR(dataUrl: string, filename: string = "qr-code.png"): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
