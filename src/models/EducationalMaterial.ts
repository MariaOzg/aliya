import mongoose, { Schema, Document } from 'mongoose';

export interface IEducationalMaterial extends Document {
  title: string;
  description: string;
  type: 'article' | 'video' | 'presentation';
  content?: string; // для статей
  fileUrl?: string; // для презентаций
  videoUrl?: string; // для видео
  thumbnailUrl?: string;
  category: string;
  author: mongoose.Types.ObjectId;
  isPublished: boolean;
  publishDate: Date;
}

const EducationalMaterialSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['article', 'video', 'presentation'],
      required: true,
    },
    content: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    thumbnailUrl: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Создаем индекс для быстрого поиска по типу
EducationalMaterialSchema.index({ type: 1 });
// Создаем индекс для поиска по категории
EducationalMaterialSchema.index({ category: 1 });
// Создаем индекс для поиска опубликованных материалов
EducationalMaterialSchema.index({ isPublished: 1, publishDate: -1 });

export default mongoose.models.EducationalMaterial || 
  mongoose.model<IEducationalMaterial>('EducationalMaterial', EducationalMaterialSchema); 