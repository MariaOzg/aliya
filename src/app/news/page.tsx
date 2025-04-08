'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface News {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'news' | 'promotion';
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

// Компонент для извлечения параметров URL
function SearchParamsReader({
  onTypeParam
}: {
  onTypeParam: (type: string | null) => void;
}) {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const typeParam = searchParams.get('type');
    onTypeParam(typeParam);
  }, [searchParams, onTypeParam]);
  
  return null;
}

export default function NewsPage() {
  const [typeParam, setTypeParam] = useState<string | null>(null);
  
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Обработчик для получения параметра type из URL
  const handleTypeParam = (type: string | null) => {
    setTypeParam(type);
    setSelectedType(type);
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // Заглушка для демонстрации, в реальном приложении здесь будет API-запрос
        // const url = selectedType
        //   ? `/api/news?type=${selectedType}&isActive=true`
        //   : '/api/news?isActive=true';
        
        // const response = await fetch(url);
        
        // if (!response.ok) {
        //   throw new Error('Ошибка при загрузке новостей');
        // }
        
        // const data = await response.json();
        
        // Моковые данные для демонстрации
        await new Promise(resolve => setTimeout(resolve, 800)); // Имитация задержки загрузки
        
        const mockNews: News[] = [
          {
            _id: '1',
            title: 'Новое отделение реабилитации',
            content: 'Мы рады сообщить об открытии нового отделения реабилитации с современным оборудованием и высококвалифицированными специалистами.',
            imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
            type: 'news',
            publishDate: '2023-10-15T10:00:00Z',
            isActive: true,
            author: {
              _id: 'a1',
              firstName: 'Иван',
              lastName: 'Петров'
            }
          },
          {
            _id: '2',
            title: 'Скидка 20% на стоматологические услуги',
            content: 'До конца месяца действует специальное предложение — скидка 20% на все стоматологические услуги при первом посещении.',
            imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
            type: 'promotion',
            publishDate: '2023-10-10T08:00:00Z',
            expiryDate: '2023-10-31T23:59:59Z',
            isActive: true,
            author: {
              _id: 'a2',
              firstName: 'Елена',
              lastName: 'Смирнова'
            }
          },
          {
            _id: '3',
            title: 'Бесплатная консультация кардиолога',
            content: 'В рамках месяца здорового сердца предлагаем бесплатную первичную консультацию кардиолога для всех пациентов.',
            imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
            type: 'promotion',
            publishDate: '2023-09-25T09:30:00Z',
            expiryDate: '2023-10-25T23:59:59Z',
            isActive: true,
            author: {
              _id: 'a1',
              firstName: 'Иван',
              lastName: 'Петров'
            }
          },
          {
            _id: '4',
            title: 'Новый врач-невролог в нашей клинике',
            content: 'Мы рады представить нового специалиста в нашей клинике — врача-невролога высшей категории с 15-летним опытом работы.',
            imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
            type: 'news',
            publishDate: '2023-10-05T14:00:00Z',
            isActive: true,
            author: {
              _id: 'a2',
              firstName: 'Елена',
              lastName: 'Смирнова'
            }
          },
          {
            _id: '5',
            title: 'График работы в праздничные дни',
            content: 'Информируем вас о графике работы нашей клиники в предстоящие праздничные дни.',
            type: 'news',
            publishDate: '2023-10-20T11:00:00Z',
            isActive: true,
            author: {
              _id: 'a3',
              firstName: 'Алексей',
              lastName: 'Сидоров'
            }
          }
        ];
        
        let filteredNews = [...mockNews];
        
        if (selectedType === 'news') {
          filteredNews = mockNews.filter(item => item.type === 'news');
        } else if (selectedType === 'promotion') {
          filteredNews = mockNews.filter(item => item.type === 'promotion');
        }
        
        setNewsItems(filteredNews);
      } catch (err) {
        console.error('Ошибка:', err);
        setError('Не удалось загрузить новости. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [selectedType]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white">
      <Suspense fallback={<div>Загрузка...</div>}>
        <SearchParamsReader onTypeParam={handleTypeParam} />
      </Suspense>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Новости и акции</h1>
          <p className="mt-4 text-lg text-gray-500">
            Будьте в курсе последних событий и специальных предложений нашей клиники
          </p>
        </div>

        {/* Фильтр по типу */}
        <div className="mt-12 flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedType === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleTypeParam(null)}
          >
            Все
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedType === 'news'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleTypeParam('news')}
          >
            Новости
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedType === 'promotion'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleTypeParam('promotion')}
          >
            Акции
          </button>
        </div>

        {/* Список новостей и акций */}
        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : newsItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет доступных новостей или акций</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newsItems.map((item) => (
                <div key={item._id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                  {item.imageUrl && (
                    <div className="relative h-48 w-full">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.title}
                        fill
                        style={{objectFit: 'cover'}}
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${
                        item.type === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.type === 'news' ? 'Новость' : 'Акция'}
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">
                      {formatDate(item.publishDate)}
                      {item.expiryDate && (
                        <span> — до {formatDate(item.expiryDate)}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                    <Link 
                      href={`/news/${item._id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Читать полностью →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 