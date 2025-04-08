import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  type: 'news' | 'promotion';
  publishDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  author: mongoose.Types.ObjectId;
}

const NewsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ['news', 'promotion'],
      required: true,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Создаем индекс для быстрого поиска по типу
NewsSchema.index({ type: 1 });
// Создаем индекс для поиска активных новостей и акций
NewsSchema.index({ isActive: 1, publishDate: -1 });

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema); 