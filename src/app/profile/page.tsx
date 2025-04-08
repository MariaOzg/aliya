'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChangeEvent, FormEvent } from 'react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    profilePicture: '',
    doctorSpecialty: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }
    
    fetchUserProfile();
  }, [session, status, router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/profile`);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные профиля');
      }
      
      const data = await response.json();
      
      setUserProfile({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        email: data.user.email || '',
        phoneNumber: data.user.phoneNumber || '',
        dateOfBirth: data.user.dateOfBirth 
          ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] 
          : '',
        profilePicture: data.user.profilePicture || '',
        doctorSpecialty: data.user.doctorSpecialty || '',
      });
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      setMessage({
        text: 'Не удалось загрузить данные профиля',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userProfile),
      });
      
      if (!response.ok) {
        throw new Error('Не удалось обновить профиль');
      }
      
      setMessage({
        text: 'Профиль успешно обновлен',
        type: 'success'
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setMessage({
        text: 'Не удалось обновить профиль',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Мой профиль</h1>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
              {userProfile.profilePicture ? (
                <Image 
                  src={userProfile.profilePicture} 
                  alt="Фото профиля"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {userProfile.firstName} {userProfile.lastName}
              </h2>
              <p className="text-gray-600">
                {session?.user?.role === 'patient' && 'Пациент'}
                {session?.user?.role === 'doctor' && 'Врач'}
                {session?.user?.role === 'admin' && 'Администратор'}
              </p>
              {session?.user?.role === 'doctor' && userProfile.doctorSpecialty && (
                <p className="text-blue-600 mt-1">
                  Специализация: {userProfile.doctorSpecialty}
                </p>
              )}
            </div>
            
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {isEditing ? 'Отменить' : 'Редактировать'}
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={userProfile.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={userProfile.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userProfile.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled
                  />
                  <p className="mt-1 text-sm text-gray-500">Email изменить нельзя</p>
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Номер телефона
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={userProfile.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Дата рождения
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={userProfile.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                {session?.user?.role === 'doctor' && (
                  <div>
                    <label htmlFor="doctorSpecialty" className="block text-sm font-medium text-gray-700">
                      Специализация
                    </label>
                    <input
                      type="text"
                      id="doctorSpecialty"
                      name="doctorSpecialty"
                      value={userProfile.doctorSpecialty}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                    URL изображения профиля
                  </label>
                  <input
                    type="url"
                    id="profilePicture"
                    name="profilePicture"
                    value={userProfile.profilePicture}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                >
                  {saving && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Сохранить изменения
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{userProfile.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Номер телефона</h3>
                <p className="mt-1">{userProfile.phoneNumber || 'Не указан'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Дата рождения</h3>
                <p className="mt-1">
                  {userProfile.dateOfBirth 
                    ? new Date(userProfile.dateOfBirth).toLocaleDateString('ru-RU') 
                    : 'Не указана'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 