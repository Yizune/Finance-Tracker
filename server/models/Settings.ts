import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const settingsSchema = new Schema(
  {
    userId: { type: String, default: null, index: true },
    darkMode: { type: Boolean },
  },
  { versionKey: false }
);

export type ISettings = InferSchemaType<typeof settingsSchema>;
export default mongoose.model('Settings', settingsSchema);
