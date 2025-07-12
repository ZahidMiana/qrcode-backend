import QRCode from 'qrcode';
import { QRCodeOptions, GenerateQRCodeParams } from '../types/qrCode';

export class QRCodeService {
  private static getSizeInPixels(size: string): number {
    switch (size) {
      case 'small':
        return 200;
      case 'medium':
        return 400;
      case 'large':
        return 800;
      default:
        return 400;
    }
  }

  public static async generateQRCode(params: GenerateQRCodeParams): Promise<string> {
    const { text, options, format = 'png' } = params;

    return new Promise((resolve, reject) => {
      try {
        const qrOptions: any = {
          errorCorrectionLevel: options.errorCorrectionLevel,
          margin: options.margin,
          color: {
            dark: options.foregroundColor,
            light: options.backgroundColor,
          },
          width: this.getSizeInPixels(options.size),
        };

        if (format === 'svg') {
          QRCode.toString(text, { ...qrOptions, type: 'svg' }, (err, string) => {
            if (err) reject(new Error(err.message));
            else resolve(string);
          });
        } else {
          QRCode.toDataURL(text, { ...qrOptions, type: 'image/png' }, (err, url) => {
            if (err) reject(new Error(err.message));
            else resolve(url);
          });
        }
      } catch (error) {
        reject(new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });
  }

  public static async generateQRCodeBuffer(params: GenerateQRCodeParams): Promise<Buffer> {
    const { text, options } = params;

    return new Promise((resolve, reject) => {
      try {
        const qrOptions: any = {
          errorCorrectionLevel: options.errorCorrectionLevel,
          margin: options.margin,
          color: {
            dark: options.foregroundColor,
            light: options.backgroundColor,
          },
          width: this.getSizeInPixels(options.size),
        };

        QRCode.toBuffer(text, qrOptions, (err, buffer) => {
          if (err) reject(new Error(err.message));
          else resolve(buffer);
        });
      } catch (error) {
        reject(new Error(`Failed to generate QR code buffer: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });
  }

  public static validateInput(input: string): { isValid: boolean; error?: string } {
    if (!input || input.trim().length === 0) {
      return { isValid: false, error: 'Input cannot be empty' };
    }

    if (input.length > 2000) {
      return { isValid: false, error: 'Input too long (max 2000 characters)' };
    }

    return { isValid: true };
  }

  public static validateOptions(options: QRCodeOptions): { isValid: boolean; error?: string } {
    const validSizes = ['small', 'medium', 'large'];
    const validErrorLevels = ['L', 'M', 'Q', 'H'];
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (!validSizes.includes(options.size)) {
      return { isValid: false, error: 'Invalid size. Must be small, medium, or large' };
    }

    if (!validErrorLevels.includes(options.errorCorrectionLevel)) {
      return { isValid: false, error: 'Invalid error correction level. Must be L, M, Q, or H' };
    }

    if (!colorRegex.test(options.foregroundColor)) {
      return { isValid: false, error: 'Invalid foreground color. Must be a valid hex color' };
    }

    if (!colorRegex.test(options.backgroundColor)) {
      return { isValid: false, error: 'Invalid background color. Must be a valid hex color' };
    }

    if (options.margin < 0 || options.margin > 20) {
      return { isValid: false, error: 'Invalid margin. Must be between 0 and 20' };
    }

    return { isValid: true };
  }
}
