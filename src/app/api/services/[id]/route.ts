import { connectToDatabase } from '@/lib/mongodb';
import Service from '@/models/Service';
import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

// Получение конкретной услуги
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = params;
    
    await connectToDatabase();
    
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Ошибка при получении услуги:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении услуги' },
      { status: 500 }
    );
  }
}

// Обновление услуги
export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await getAuthSession();
    
    // Проверяем авторизацию и роль
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    const body = await req.json();
    
    await connectToDatabase();
    
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }
    
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    
    return NextResponse.json(
      {
        success: true,
        message: 'Услуга успешно обновлена',
        service: updatedService,
      }
    );
  } catch (error) {
    console.error('Ошибка при обновлении услуги:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при обновлении услуги' },
      { status: 500 }
    );
  }
}

// Удаление услуги
export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await getAuthSession();
    
    // Проверяем авторизацию и роль
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }
    
    const { id } = params;
    
    await connectToDatabase();
    
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Услуга не найдена' },
        { status: 404 }
      );
    }
    
    await Service.findByIdAndDelete(id);
    
    return NextResponse.json(
      {
        success: true,
        message: 'Услуга успешно удалена',
      }
    );
  } catch (error) {
    console.error('Ошибка при удалении услуги:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при удалении услуги' },
      { status: 500 }
    );
  }
} 
 