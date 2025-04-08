import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  role: 'patient' | 'doctor' | 'admin';
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
  // Дополнительные поля для докторов
  specialties?: string[];
  experience?: number;
  education?: string;
  languages?: string[];
  // Методы
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// Schema definition
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    role: { 
      type: String, 
      enum: ['patient', 'doctor', 'admin'], 
      default: 'patient', 
      required: true 
    },
    profilePicture: { type: String },
    // Поля только для докторов
    specialties: [{ type: String }],
    experience: { type: Number },
    education: { type: String },
    languages: [{ type: String }],
  },
  { timestamps: true }
);

// Метод для проверки пароля
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(`Ошибка при сравнении паролей: ${error}`);
  }
};

// Хук pre-save для хеширования пароля перед сохранением
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Проверяем существует ли модель, чтобы избежать ошибки OverwriteModelError
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;