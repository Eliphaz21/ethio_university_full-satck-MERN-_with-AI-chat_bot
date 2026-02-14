import mongoose from 'mongoose';
import { MONGO_URI } from './env.ts';

export async function connectDB() {
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err: any) {
    console.error('❌ MongoDB connection error:', err?.message || err);
    if (err?.code === 'ESERVFAIL' || err?.message?.includes('queryTxt') || err?.code === 'ENOTFOUND') {
      console.error('💡 This is usually a DNS/network issue: check internet, try another DNS (e.g. 8.8.8.8), or disable VPN.');
    }
    process.exit(1);
  }
}