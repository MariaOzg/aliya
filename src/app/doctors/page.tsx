'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  doctorSpecialty: string;
  profilePicture?: string;
  email: string;
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Загрузка врачей из API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // В реальном приложении это будет API-запрос
        // Поскольку у нас еще нет API для врачей, используем моковые данные
        
        // Имитация задержки загрузки
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockDoctors: Doctor[] = [
          {
            _id: '1',
            firstName: 'Иван',
            lastName: 'Петров',
            doctorSpecialty: 'Кардиология',
            email: 'petrov@medclinic.ru',
            profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          {
            _id: '2',
            firstName: 'Елена',
            lastName: 'Смирнова',
            doctorSpecialty: 'Терапия',
            email: 'smirnova@medclinic.ru',
            profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg'
          },
          {
            _id: '3',
            firstName: 'Алексей',
            lastName: 'Иванов',
            doctorSpecialty: 'Неврология',
            email: 'ivanov@medclinic.ru',
            profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg'
          },
          {
            _id: '4',
            firstName: 'Ольга',
            lastName: 'Соколова',
            doctorSpecialty: 'Стоматология',
            email: 'sokolova@medclinic.ru',
            profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg'
          },
          {
            _id: '5',
            firstName: 'Дмитрий',
            lastName: 'Николаев',
            doctorSpecialty: 'Диагностика',
            email: 'nikolaev@medclinic.ru',
            profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg'
          },
          {
            _id: '6',
            firstName: 'Марина',
            lastName: 'Козлова',
            doctorSpecialty: 'Кардиология',
            email: 'kozlova@medclinic.ru',
            profilePicture: 'https://randomuser.me/api/portraits/women/6.jpg'
          }
        ];
        
        // Фильтрация по специальности, если выбрана
        const filteredDoctors = selectedSpecialty 
          ? mockDoctors.filter(doc => doc.doctorSpecialty === selectedSpecialty)
          : mockDoctors;
        
        setDoctors(filteredDoctors);
        
        // Извлекаем уникальные специальности
        const uniqueSpecialties = Array.from(new Set(mockDoctors.map(doctor => doctor.doctorSpecialty)));
        setSpecialties(uniqueSpecialties);
      } catch (err) {
        console.error('Ошибка при загрузке списка врачей:', err);
        setError('Не удалось загрузить список врачей. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, [selectedSpecialty]);

  const handleSpecialtyChange = (specialty: string | null) => {
    setSelectedSpecialty(specialty);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Наши врачи</h1>
          <p className="mt-4 text-lg text-gray-500">
            Квалифицированные специалисты нашей клиники готовы оказать вам помощь
          </p>
        </div>

        {/* Фильтр по специальностям */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedSpecialty === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleSpecialtyChange(null)}
          >
            Все специалисты
          </button>
          
          {specialties.map((specialty) => (
            <button
              key={specialty}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedSpecialty === specialty
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleSpecialtyChange(specialty)}
            >
              {specialty}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-red-600">{error}</div>
        ) : doctors.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-500">
              {selectedSpecialty 
                ? `Нет врачей в категории "${selectedSpecialty}".` 
                : 'Нет доступных врачей.'}
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div 
                key={doctor._id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
              >
                <div className="h-48 w-full bg-gray-200">
                  {doctor.profilePicture ? (
                    <Image
                      src={doctor.profilePicture}
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      className="h-full w-full object-cover"
                      width={400}
                      height={300}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-100">
                      <span className="text-3xl text-blue-500">
                        {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {doctor.firstName} {doctor.lastName}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {doctor.doctorSpecialty}
                    </span>
                  </div>
                  <p className="mt-4 text-gray-500">
                    {doctor.email}
                  </p>
                  <div className="mt-4">
                    <Link 
                      href={`/auth/login?redirect=/appointments/new?doctorId=${doctor._id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full justify-center"
                    >
                      Записаться на приём
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