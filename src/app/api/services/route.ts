import { connectToDatabase } from '@/lib/mongodb';
import Service from '@/models/Service';
import { getAuthSession } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Получение всех медицинских услуг
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const isActive = url.searchParams.get('isActive');
    
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    await connectToDatabase();
    
    const services = await Service.find(query).sort({ category: 1, name: 1 });
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Ошибка при получении услуг:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении услуг' },
      { status: 500 }
    );
  }
}

// Добавление новой медицинской услуги
export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    
    // Проверяем авторизацию и роль
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
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