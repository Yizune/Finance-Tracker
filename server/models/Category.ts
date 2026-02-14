import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const categorySchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

export type ICategory = InferSchemaType<typeof categorySchema>;
export default mongoose.model('Categories', categorySchema);
