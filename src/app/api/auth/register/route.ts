import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, role, phoneNumber } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    // Подключаемся к базе данных
    await connectToDatabase();

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Создаем нового пользователя
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'patient',
      phoneNumber: phoneNumber || '',
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Пользователь успешно зарегистрирован',
        user: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при регистрации' },
      { status: 500 }
    );
  }
} 