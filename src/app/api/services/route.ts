import { connectToDatabase } from '@/lib/mongodb';
import Service from '@/models/Service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Получение всех медицинских услуг
export async function GET() {
  try {
    await connectToDatabase();
    
    // Используем интерфейс вместо any
    interface QueryParams {
      category?: string;
      featured?: boolean;
    }
    
    const query: QueryParams = {};
    // Здесь могут быть дополнительные фильтры, если они передаются в запросе
    
    const services = await Service.find(query).sort({ category: 1, name: 1 });
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Ошибка при получении сервисов:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении сервисов' },
      { status: 500 }
    );
  }
}

// Добавление новой медицинской услуги
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем авторизацию и роль
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { name, description, price, duration, category, imageUrl } = body;
    
    if (!name || !description || !price || !duration || !category) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const newService = new Service({
      name,
      description,
      price,
      duration,
      category,
      imageUrl,
      isActive: true,
    });
    
    await newService.save();
    
    return NextResponse.json(
      {
        success: true,
        message: 'Услуга успешно добавлена',
        service: newService,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при добавлении услуги:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при добавлении услуги' },
      { status: 500 }
    );
  }
} 