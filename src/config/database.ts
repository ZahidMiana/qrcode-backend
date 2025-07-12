import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/qrcode-generator';
    
    console.log('🔗 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoUri);
    
    console.log(`📚 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    console.error('📋 MongoDB URI format check:', process.env.MONGODB_URI ? 'URI provided' : 'URI missing');
    // Don't exit in serverless environment - just log the error
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('📚 MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});
