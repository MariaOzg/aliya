'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface Appointment {
  id: string;
  doctorName: string;
  serviceName: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function AppointmentsPage() {
  const { } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      // Эмуляция задержки API-запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Мок-данные для тестирования
      const mockData: Appointment[] = [
        {
          id: '1',
          doctorName: 'Др. Иванов Иван',
          serviceName: 'Консультация терапевта',
          date: new Date(Date.now() + 86400000), // завтра
          status: 'upcoming',
        },
        {
          id: '2',
          doctorName: 'Др. Петрова Елена',
          serviceName: 'Осмотр стоматолога',
          date: new Date(Date.now() - 86400000), // вчера
          status: 'completed',
        },
        {
          id: '3',
          doctorName: 'Др. Сидоров Алексей',
          serviceName: 'Консультация невролога',
          date: new Date(Date.now() + 172800000), // послезавтра
          status: 'upcoming',
        },
        {
          id: '4',
          doctorName: 'Др. Смирнова Ольга',
          serviceName: 'УЗИ брюшной полости',
          date: new Date(Date.now() - 172800000), // позавчера
          status: 'cancelled',
        },
      ];
      
      setAppointments(mockData);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке записей. Пожалуйста, попробуйте позже.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const cancelAppointment = async (id: string) => {
    try {
      // Эмуляция API-запроса на отмену
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'cancelled' as const } 
            : appointment
        )
      );
    } catch (err) {
      setError('Не удалось отменить запись. Пожалуйста, попробуйте позже.');
      console.error('Error cancelling appointment:', err);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    if (filter === 'upcoming') {
      return appointment.date > now && appointment.status === 'upcoming';
    } else if (filter === 'past') {
      return appointment.date < now || appointment.status !== 'upcoming';
    }
    return true;
  });

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return '';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming': return 'Предстоящая';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return '';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const Content = () => (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Мои записи</h1>
      
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Предстоящие
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded ${filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Прошедшие
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <p className="text-gray-600">Записи не найдены.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{appointment.doctorName}</h3>
                  <p className="text-gray-600">{appointment.serviceName}</p>
                  <p className="text-gray-500 mt-1">{formatDate(appointment.date)}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(appointment.status)} bg-opacity-10`}>
                    {getStatusText(appointment.status)}
                  </span>
                  
                  {appointment.status === 'upcoming' && (
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      className="block mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Отменить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
} 