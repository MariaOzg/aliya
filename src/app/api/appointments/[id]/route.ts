import { connectToDatabase } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

// Получение конкретной записи на прием
export async function GET(req: Request, { params }: Params) {
  try {
    const session = await getAuthSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    await connectToDatabase();
    
    const appointment = await Appointment.findById(id)
      .populate('patient', 'firstName lastName email phoneNumber')
      .populate('doctor', 'firstName lastName doctorSpecialty');
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Запись на прием не найдена' },
        { status: 404 }
      );
    }
    
    // Проверяем право доступа к записи
    if (
      session.user.role === 'patient' && 
      appointment.patient._id.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }
    
    if (
      session.user.role === 'doctor' && 
      appointment.doctor._id.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Ошибка при получении записи на прием:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении записи на прием' },
      { status: 500 }
    );
  }
}

// Обновление записи на прием
export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getAuthSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    const body = await req.json();
    
    await connectToDatabase();
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Запись на прием не найдена' },
        { status: 404 }
      );
    }
    
    // Проверяем право доступа к записи
    if (
      session.user.role === 'patient' && 
      appointment.patient.toString() !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }
    
    // Пациенты могут только отменять свои записи
    if (session.user.role === 'patient') {
      if (body.status !== 'cancelled') {
        return NextResponse.json(
          { error: 'Пациенты могут только отменять записи' },
          { status: 403 }
        );
      }
      
      appointment.status = 'cancelled';
      await appointment.save();
      
      return NextResponse.json({
        success: true,
        message: 'Запись на прием успешно отменена',
        appointment
      });
    }
    
    // Врачи и администраторы могут обновлять статус и добавлять заметки
    if (['doctor', 'admin'].includes(session.user.role)) {
      if (body.status) appointment.status = body.status;
      if (body.notes) appointment.notes = body.notes;
      
      await appointment.save();
      
      const updatedAppointment = await Appointment.findById(id)
        .populate('patient', 'firstName lastName email phoneNumber')
        .populate('doctor', 'firstName lastName doctorSpecialty');
      
      return NextResponse.json({
        success: true,
        message: 'Запись на прием успешно обновлена',
        appointment: updatedAppointment
      });
    }
    
    return NextResponse.json(
      { error: 'Доступ запрещен' },
      { status: 403 }
    );
    
  } catch (error) {
    console.error('Ошибка при обновлении записи на прием:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении записи на прием' },
      { status: 500 }
    );
  }
}

// Удаление записи на прием (только для администраторов)
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getAuthSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    await connectToDatabase();
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Запись на прием не найдена' },
        { status: 404 }
      );
    }
    
    await Appointment.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Запись на прием успешно удалена'
    });
  } catch (error) {
    console.error('Ошибка при удалении записи на прием:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении записи на прием' },
      { status: 500 }
    );
  }
} 