import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

// Обработчик GET-запроса для получения данных профиля
export async function GET() {
  try {
    const session = await getServerSession();
    
    // Проверяем авторизацию
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }
    
    // Подключаемся к БД
    await connectToDatabase();
    
    // Ищем пользователя по email
    const user = await User.findOne({ email: session.user.email }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении профиля' },
      { status: 500 }
    );
  }
}

// Обработчик PUT-запроса для обновления профиля
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Проверяем авторизацию
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }
    
    // Получаем данные из запроса
    const data = await request.json();
    
    // Подключаемся к БД
    await connectToDatabase();
    
    // Ищем пользователя по email
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    // Обновляем только разрешенные поля
    // Email не обновляем, так как он используется как идентификатор
    const allowedUpdates = [
      'firstName', 
      'lastName', 
      'phoneNumber', 
      'dateOfBirth', 
      'profilePicture'
    ];
    
    // Добавляем поле специализации только для врачей
    if (session.user.role === 'doctor') {
      allowedUpdates.push('doctorSpecialty');
    }
    
    // Применяем обновления
    allowedUpdates.forEach((field) => {
      if (data[field] !== undefined) {
        // Используем type assertion для безопасного доступа к динамическим свойствам
        (user as any)[field] = data[field];
      }
    });
    
    // Сохраняем изменения
    await user.save();
    
    return NextResponse.json({ 
      message: 'Профиль успешно обновлен',
      user: user.toObject({ getters: true, virtuals: true })
    });
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при обновлении профиля' },
      { status: 500 }
    );
  }
} 