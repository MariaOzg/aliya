'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  imageUrl?: string;
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка услуг и категорий
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const url = selectedCategory
          ? `/api/services?category=${selectedCategory}&isActive=true`
          : '/api/services?isActive=true';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Ошибка при загрузке услуг');
        }
        
        const data = await response.json() as Service[];
        setServices(data);
        
        // Извлекаем уникальные категории
        const uniqueCategories = Array.from(new Set(data.map(service => service.category)));
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Не удалось загрузить услуги. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, [selectedCategory]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Наши услуги</h1>
          <p className="mt-4 text-lg text-gray-500">
            Мы предлагаем широкий спектр медицинских услуг для поддержания вашего здоровья
          </p>
        </div>

        {/* Фильтр по категориям */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryChange(null)}
          >
            Все услуги
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-red-600">{error}</div>
        ) : services.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-500">
              {selectedCategory 
                ? `В категории "${selectedCategory}" нет доступных услуг.` 
                : 'Нет доступных услуг.'}
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div 
                key={service._id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                {service.imageUrl && (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {service.name}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {service.category}
                    </span>
                    <span className="ml-2">
                      {service.duration} мин.
                    </span>
                  </div>
                  <p className="mt-4 text-gray-500 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-semibold text-gray-900">
                      {service.price.toLocaleString('ru-RU')} ₽
                    </span>
                    <Link 
                      href={`/auth/login?redirect=/appointments/new?serviceId=${service._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Записаться
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 