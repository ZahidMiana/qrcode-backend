import mongoose, { Schema, Document } from 'mongoose';
import { QRCodeOptions } from '../types/qrCode';

export interface IQRCode extends Document {
  input: string;
  options: QRCodeOptions;
  createdAt: Date;
  userId?: string;
}

const QRCodeSchema = new Schema<IQRCode>({
  input: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  options: {
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    foregroundColor: {
      type: String,
      default: '#000000',
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    errorCorrectionLevel: {
      type: String,
      enum: ['L', 'M', 'Q', 'H'],
      default: 'M',
    },
    margin: {
      type: Number,
      default: 4,
      min: 0,
      max: 20,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 * 30, // 30 days TTL
  },
  userId: {
    type: String,
    required: false,
  },
});

// Create indexes for better performance
QRCodeSchema.index({ createdAt: -1 });
QRCodeSchema.index({ userId: 1, createdAt: -1 });

export const QRCodeModel = mongoose.model<IQRCode>('QRCode', QRCodeSchema);
