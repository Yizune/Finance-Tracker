import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const transactionSchema = new Schema(
  {
    id: { type: Number, required: true },
    userId: { type: String, default: null, index: true },
    type: { type: String, enum: ['income', 'expense'] as const, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      required: true,
    },
    date: { type: String, required: true },
    description: { type: String, required: false },
  },
  { versionKey: false }
);

export type ITransaction = InferSchemaType<typeof transactionSchema>;
export default mongoose.model('Transaction', transactionSchema);
