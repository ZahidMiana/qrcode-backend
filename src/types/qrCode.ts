export interface QRCodeOptions {
  size: 'small' | 'medium' | 'large';
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
}

export interface QRCodeRequest {
  input: string;
  options: QRCodeOptions;
}

export interface QRCodeResponse {
  id: string;
  input: string;
  options: QRCodeOptions;
  qrCodeData: string;
  shareableLink?: string;
  createdAt: Date;
}

export interface QRCodeDocument {
  _id: string;
  input: string;
  options: QRCodeOptions;
  createdAt: Date;
  userId?: string;
}

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRCodeSize = 'small' | 'medium' | 'large';

export interface GenerateQRCodeParams {
  text: string;
  options: QRCodeOptions;
  format?: 'png' | 'jpeg' | 'svg';
}
