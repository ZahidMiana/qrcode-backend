import { Request, Response, NextFunction } from 'express';
import { QRCodeModel } from '../models/QRCode';
import { QRCodeService } from '../services/qrCodeService';
import { QRCodeOptions, QRCodeRequest } from '../types/qrCode';

export class QRCodeController {
  public static async generateQRCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { input, options }: QRCodeRequest = req.body;

      // Default options
      const qrOptions: QRCodeOptions = {
        size: options?.size || 'medium',
        foregroundColor: options?.foregroundColor || '#000000',
        backgroundColor: options?.backgroundColor || '#ffffff',
        errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        margin: options?.margin || 4,
      };

      // Validate input
      const inputValidation = QRCodeService.validateInput(input);
      if (!inputValidation.isValid) {
        res.status(400).json({
          success: false,
          error: inputValidation.error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Validate options
      const optionsValidation = QRCodeService.validateOptions(qrOptions);
      if (!optionsValidation.isValid) {
        res.status(400).json({
          success: false,
          error: optionsValidation.error,
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Generate QR code
      const qrCodeData = await QRCodeService.generateQRCode({
        text: input,
        options: qrOptions,
      });

      // Save to database
      const qrCodeDoc = new QRCodeModel({
        input,
        options: qrOptions,
      });

      const savedDoc = await qrCodeDoc.save();

      res.status(201).json({
        success: true,
        data: {
          id: savedDoc._id,
          input,
          options: qrOptions,
          qrCodeData,
          shareableLink: `${req.protocol}://${req.get('host')}/api/qrcode/${savedDoc._id}`,
          createdAt: savedDoc.createdAt,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  public static async downloadQRCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { format = 'png' } = req.query;

      const qrCodeDoc = await QRCodeModel.findById(id);
      if (!qrCodeDoc) {
        res.status(404).json({
          success: false,
          error: 'QR code not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const buffer = await QRCodeService.generateQRCodeBuffer({
        text: qrCodeDoc.input,
        options: qrCodeDoc.options,
        format: format as 'png' | 'jpeg' | 'svg',
      });

      const filename = `qrcode-${id}.${format}`;
      
      res.setHeader('Content-Type', `image/${format}`);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);
      
      res.end(buffer);
    } catch (error) {
      next(error);
    }
  }

  public static async getQRCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const qrCodeDoc = await QRCodeModel.findById(id);
      if (!qrCodeDoc) {
        res.status(404).json({
          success: false,
          error: 'QR code not found',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const qrCodeData = await QRCodeService.generateQRCode({
        text: qrCodeDoc.input,
        options: qrCodeDoc.options,
      });

      res.status(200).json({
        success: true,
        data: {
          id: qrCodeDoc._id,
          input: qrCodeDoc.input,
          options: qrCodeDoc.options,
          qrCodeData,
          createdAt: qrCodeDoc.createdAt,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getRecentQRCodes(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit = 10, page = 1 } = req.query;
      const limitNum = parseInt(limit as string, 10);
      const pageNum = parseInt(page as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const qrCodes = await QRCodeModel.find()
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip(skip)
        .select('-__v');

      const total = await QRCodeModel.countDocuments();

      res.status(200).json({
        success: true,
        data: qrCodes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
}
