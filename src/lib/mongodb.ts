import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Пожалуйста, укажите MONGODB_URI в переменных окружения'
  );
}

/**
 * Глобальная переменная для сохранения состояния подключения
 * между горячими перезагрузками
 */
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseConnection = global.mongoose as MongooseConnection;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Подключение к MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log('Подключение к MongoDB успешно установлено');
        return mongoose;
      })
      .catch((error) => {
        console.error('Ошибка подключения к MongoDB:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Не удалось подключиться к MongoDB:', e);
    throw e;
  }

  return cached.conn;
} 