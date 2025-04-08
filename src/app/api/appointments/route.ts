import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Получение всех записей на прием с фильтрацией
export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const doctorId = url.searchParams.get('doctorId');
    const patientId = url.searchParams.get('patientId');
    const status = url.searchParams.get('status');
    const date = url.searchParams.get('date');
    
    const query: any = {};
    
    // Пациенты могут видеть только свои записи
    if (session.user.role === 'patient') {
      query.patient = session.user.id;
    } 
    // Врачи могут видеть только записи к ним
    else if (session.user.role === 'doctor') {
      query.doctor = session.user.id;
    } 
    // Администраторы могут использовать фильтры для любых записей
    else if (session.user.role === 'admin') {
      if (doctorId) query.doctor = doctorId;
      if (patientId) query.patient = patientId;
    }
    
    if (status) query.status = status;
    
    if (date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: dateObj,
        $lt: nextDay
      };
    }
    
    await connectToDatabase();
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName email phoneNumber')
      .populate('doctor', 'firstName lastName doctorSpecialty')
      .sort({ date: 1, startTime: 1 });
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Ошибка при получении записей на прием:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении записей на прием' },
      { status: 500 }
    );
  }
}

// Создание новой записи на прием
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    let { patient, doctor, date, startTime, endTime, reason, notes } = body;
    
    // Пациенты могут создавать записи только для себя
    if (session.user.role === 'patient') {
      patient = session.user.id;
    }
    
    if (!patient || !doctor || !date || !startTime || !endTime || !reason) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Проверяем, не занято ли время у врача
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(appointmentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const existingAppointment = await Appointment.findOne({
      doctor,
      date: {
        $gte: appointmentDate,
        $lt: nextDay
      },
      $or: [
        { 
          startTime: { $lte: startTime }, 
          endTime: { $gt: startTime } 
        },
        { 
          startTime: { $lt: endTime }, 
          endTime: { $gte: endTime } 
        },
        { 
          startTime: { $gte: startTime }, 
          endTime: { $lte: endTime } 
        }
      ],
      status: { $ne: 'cancelled' }
    });
    
    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Выбранное время уже занято' },
        { status: 409 }
      );
    }
    
    const newAppointment = new Appointment({
      patient,
      doctor,
      date: appointmentDate,
      startTime,
      endTime,
      reason,
      notes,
      status: 'pending'
    });
    
    await newAppointment.save();
    
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate('patient', 'firstName lastName email phoneNumber')
      .populate('doctor', 'firstName lastName doctorSpecialty');
    
    return NextResponse.json(
      {
        success: true,
        message: 'Запись на прием успешно создана',
        appointment: populatedAppointment
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при создании записи на прием:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при создании записи на прием' },
      { status: 500 }
    );
  }
} 