'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  doctorSpecialty: string;
}

interface Service {
  _id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function NewAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const doctorIdParam = searchParams.get('doctorId');
  const serviceIdParam = searchParams.get('serviceId');
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>(doctorIdParam || '');
  const [selectedService, setSelectedService] = useState<string>(serviceIdParam || '');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Получаем минимальную дату (завтра)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Получаем максимальную дату (через 30 дней)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Загружаем врачей и услуги при загрузке компонента
  useEffect(() => {
    const fetchDoctorsAndServices = async () => {
      try {
        // В реальном приложении тут будут api запросы
        const mockDoctors: Doctor[] = [
          { _id: '1', firstName: 'Иван', lastName: 'Петров', doctorSpecialty: 'Кардиология' },
          { _id: '2', firstName: 'Елена', lastName: 'Смирнова', doctorSpecialty: 'Терапия' },
          { _id: '3', firstName: 'Алексей', lastName: 'Иванов', doctorSpecialty: 'Неврология' },
          { _id: '4', firstName: 'Ольга', lastName: 'Соколова', doctorSpecialty: 'Стоматология' }
        ];
        
        const mockServices: Service[] = [
          { _id: '1', name: 'Консультация кардиолога', duration: 30, price: 2500, category: 'Кардиология' },
          { _id: '2', name: 'УЗИ сердца', duration: 45, price: 3000, category: 'Кардиология' },
          { _id: '3', name: 'Консультация терапевта', duration: 30, price: 2000, category: 'Терапия' },
          { _id: '4', name: 'Консультация невролога', duration: 40, price: 2300, category: 'Неврология' },
          { _id: '5', name: 'Лечение кариеса', duration: 60, price: 4500, category: 'Стоматология' }
        ];
        
        setDoctors(mockDoctors);
        setServices(mockServices);
        
        // Если есть параметры из URL, устанавливаем их
        if (doctorIdParam) {
          setSelectedDoctor(doctorIdParam);
        }
        
        if (serviceIdParam) {
          setSelectedService(serviceIdParam);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      }
    };
    
    fetchDoctorsAndServices();
  }, [doctorIdParam, serviceIdParam]);

  // Генерируем временные слоты при выборе даты
  useEffect(() => {
    if (selectedDate) {
      // В реальном приложении тут будет API запрос для получения доступных слотов
      // Сейчас просто генерируем слоты с 9:00 до 18:00 с интервалом 30 минут
      const slots: TimeSlot[] = [];
      const start = 9; // 9:00
      const end = 18; // 18:00
      const interval = 30; // 30 минут
      
      for (let hour = start; hour < end; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          // Рандомно определяем доступность слота (в реальном приложении будет из API)
          const available = Math.random() > 0.3; // примерно 70% слотов доступны
          slots.push({ time, available });
        }
      }
      
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedService || !selectedDate || !selectedTime || !reason) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Получаем выбранную услугу для определения продолжительности
      const service = services.find(s => s._id === selectedService);
      if (!service) {
        throw new Error('Услуга не найдена');
      }
      
      // Рассчитываем время окончания
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startDate = new Date(selectedDate);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + service.duration);
      
      const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
      
      // В реальном приложении тут будет API запрос для создания записи
      console.log('Отправка данных на сервер:', {
        patient: session?.user.id,
        doctor: selectedDoctor,
        date: selectedDate,
        startTime: selectedTime,
        endTime,
        reason,
        service: selectedService
      });
      
      // Имитация задержки запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('Запись на прием успешно создана!');
      
      // После успешной записи перенаправляем на страницу с записями
      setTimeout(() => {
        router.push('/appointments');
      }, 2000);
    } catch (error: any) {
      console.error('Ошибка при создании записи:', error);
      setError(error.message || 'Произошла ошибка при создании записи на прием');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Запись на прием</h1>
          <p className="mt-2 text-sm text-gray-600">
            Выберите врача, услугу, дату и время для записи на прием
          </p>
        </div>
        
        {successMessage ? (
          <div className="rounded-md bg-green-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
                <p className="mt-2 text-sm text-green-600">
                  Перенаправление на страницу ваших записей...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                Врач <span className="text-red-500">*</span>
              </label>
              <select
                id="doctor"
                name="doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Выберите врача</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.firstName} {doctor.lastName} ({doctor.doctorSpecialty})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                Услуга <span className="text-red-500">*</span>
              </label>
              <select
                id="service"
                name="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Выберите услугу</option>
                {services
                  .filter(service => !selectedDoctor || 
                    !doctors.find(d => d._id === selectedDoctor)?.doctorSpecialty || 
                    service.category === doctors.find(d => d._id === selectedDoctor)?.doctorSpecialty
                  )
                  .map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} ({service.duration} мин, {service.price} ₽)
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Дата <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                min={minDate}
                max={maxDateStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Время <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2 px-3 text-sm font-medium rounded-md ${
                        selectedTime === slot.time
                          ? 'bg-blue-600 text-white'
                          : slot.available
                            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Причина обращения <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Опишите кратко причину обращения"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Отправка...' : 'Записаться на прием'}
              </button>
            </div>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
} 