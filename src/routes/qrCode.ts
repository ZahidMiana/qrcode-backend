import { Router } from 'express';
import { QRCodeController } from '../controllers/qrCodeController';
import { validateQRCodeInput, handleValidationErrors } from '../middleware/validation';

const router = Router();

// Generate QR code
router.post(
  '/generate',
  validateQRCodeInput,
  handleValidationErrors,
  QRCodeController.generateQRCode
);

// Get QR code by ID
router.get('/:id', QRCodeController.getQRCode);

// Download QR code by ID
router.get('/:id/download', QRCodeController.downloadQRCode);

// Get recent QR codes (for dashboard/history)
router.get('/', QRCodeController.getRecentQRCodes);

export default router;
