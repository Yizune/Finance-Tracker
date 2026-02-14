import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './server/.env' });

const uri = process.env.MONGO_URI ?? '';

const clientOptions: mongoose.ConnectOptions = {
  serverApi: { version: '1', strict: false, deprecationErrors: true },
};

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db!.admin().command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
