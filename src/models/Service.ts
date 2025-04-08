import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  duration: number; // в минутах
  category: string;
  imageUrl?: string;
  isActive: boolean;
}

const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 5,
      comment: 'Продолжительность услуги в минутах',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Создаем индекс для быстрого поиска по категории
ServiceSchema.index({ category: 1 });
// Создаем индекс для поиска активных услуг
ServiceSchema.index({ isActive: 1 });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema); 