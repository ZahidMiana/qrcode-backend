import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateQRCodeInput = [
  body('input')
    .notEmpty()
    .withMessage('Input is required')
    .isLength({ max: 2000 })
    .withMessage('Input must not exceed 2000 characters')
    .trim(),
  
  body('options.size')
    .optional()
    .isIn(['small', 'medium', 'large'])
    .withMessage('Size must be small, medium, or large'),
  
  body('options.foregroundColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Foreground color must be a valid hex color'),
  
  body('options.backgroundColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Background color must be a valid hex color'),
  
  body('options.errorCorrectionLevel')
    .optional()
    .isIn(['L', 'M', 'Q', 'H'])
    .withMessage('Error correction level must be L, M, Q, or H'),
  
  body('options.margin')
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage('Margin must be an integer between 0 and 20'),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation error',
      details: errors.array(),
      timestamp: new Date().toISOString(),
    });
    return;
  }
  
  next();
};
