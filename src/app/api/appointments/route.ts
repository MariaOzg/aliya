import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

// Получение всех записей пользователя
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем авторизацию
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }
    
    await connectToDatabase();
    
    let appointments;
    
    // В зависимости от роли пользователя получаем разные записи
    try {
      const user = await User.findOne({ email: session.user.email });
      
      if (!user) {
        return NextResponse.json(
          { error: 'Пользователь не найден' },
          { status: 404 }
        );
      }
      
      if (session.user.role === 'patient') {
        appointments = await Appointment.find({ patient: user._id })
          .populate('doctor', 'firstName lastName doctorSpecialty profilePicture')
          .sort({ date: -1 });
      } else if (session.user.role === 'doctor') {
        appointments = await Appointment.find({ doctor: user._id })
          .populate('patient', 'firstName lastName profilePicture')
          .sort({ date: -1 });
      } else if (session.user.role === 'admin') {
        // Для админа показываем все записи
        appointments = await Appointment.find({})
          .populate('patient', 'firstName lastName profilePicture')
          .populate('doctor', 'firstName lastName doctorSpecialty profilePicture')
          .sort({ date: -1 });
      } else {
        return NextResponse.json(
          { error: 'Недостаточно прав' },
          { status: 403 }
        );
      }
      
      return NextResponse.json({ appointments });
    } catch (error) {
      console.error('Ошибка при получении записей:', error);
      return NextResponse.json(
        { error: 'Ошибка сервера при получении записей' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Ошибка при получении записей:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при получении записей' },
      { status: 500 }
    );
  }
}

// Создание новой записи
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем авторизацию
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }
    
    // Проверяем, что пользователь - пациент
    if (session.user.role !== 'patient' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Только пациенты и администраторы могут создавать записи на прием' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { doctor, date, startTime, endTime, reason, notes } = body;
    
    // Проверяем наличие обязательных полей
    if (!doctor || !date || !startTime || !endTime || !reason) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Находим пациента по email
    const patient = await User.findOne({ email: session.user.email });
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Пациент не найден' },
        { status: 404 }
      );
    }
    
    // Создаем новую запись
    const appointment = new Appointment({
      patient: patient._id,
      doctor,
      date: new Date(date),
      startTime,
      endTime,
      reason,
      notes: notes || '',
      status: 'pending'
    });
    
    await appointment.save();
    
    return NextResponse.json(
      { message: 'Запись успешно создана', appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при создании записи:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при создании записи' },
      { status: 500 }
    );
  }
} 