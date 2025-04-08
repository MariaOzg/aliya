'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/logo.png" 
                  alt="Медмел" 
                  width={200} 
                  height={60} 
                  priority
                  className="h-auto"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-6">
              <Link href="/" className="text-teal-600 hover:text-teal-800 border-transparent hover:border-teal-500 px-3 py-2 text-sm font-medium border-b-2 transition-all">
                Главная
              </Link>
              <Link href="/services" className="text-teal-600 hover:text-teal-800 border-transparent hover:border-teal-500 px-3 py-2 text-sm font-medium border-b-2 transition-all">
                Услуги
              </Link>
              <Link href="/doctors" className="text-teal-600 hover:text-teal-800 border-transparent hover:border-teal-500 px-3 py-2 text-sm font-medium border-b-2 transition-all">
                Врачи
              </Link>
              <Link href="/about" className="text-teal-600 hover:text-teal-800 border-transparent hover:border-teal-500 px-3 py-2 text-sm font-medium border-b-2 transition-all">
                О клинике
              </Link>
              <Link href="/contacts" className="text-teal-600 hover:text-teal-800 border-transparent hover:border-teal-500 px-3 py-2 text-sm font-medium border-b-2 transition-all">
                Контакты
              </Link>
              <Link href="/news" className="text-teal-600 hover:text-teal-800 border-transparent hover:border-teal-500 px-3 py-2 text-sm font-medium border-b-2 transition-all">
                Новости
              </Link>
              <Link href="/education" className="text-teal-600 hover:text-teal-800 border-transparent hover:border-teal-500 px-3 py-2 text-sm font-medium border-b-2 transition-all">
                Образование
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="ml-3 relative flex items-center">
                <span className="text-gray-700 mr-4">
                  {session.user.name}
                </span>
                
                {session.user.role === 'admin' && (
                  <Link href="/admin" className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium mr-2 transition-colors">
                    Панель админа
                  </Link>
                )}
                
                {session.user.role === 'doctor' && (
                  <Link href="/doctor" className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium mr-2 transition-colors">
                    Мои приемы
                  </Link>
                )}
                
                {session.user.role === 'patient' && (
                  <Link href="/appointments" className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-2 rounded-md text-sm font-medium mr-2 transition-colors">
                    Мои записи
                  </Link>
                )}
                
                <button
                  onClick={() => signOut()}
                  className="text-white bg-red-600 hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div>
                <Link href="/auth/login" className="text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Войти
                </Link>
                <Link href="/auth/register" className="text-white bg-green-600 hover:bg-green-500 ml-3 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-600 hover:text-teal-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-expanded="false"
            >
              <span className="sr-only">Открыть меню</span>
              {/* Иконка меню */}
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Иконка закрытия */}
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/" className="text-teal-600 hover:bg-gray-100 hover:text-teal-800 block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-teal-500">
            Главная
          </Link>
          <Link href="/services" className="text-teal-600 hover:bg-gray-100 hover:text-teal-800 block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-teal-500">
            Услуги
          </Link>
          <Link href="/doctors" className="text-teal-600 hover:bg-gray-100 hover:text-teal-800 block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-teal-500">
            Врачи
          </Link>
          <Link href="/about" className="text-teal-600 hover:bg-gray-100 hover:text-teal-800 block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-teal-500">
            О клинике
          </Link>
          <Link href="/contacts" className="text-teal-600 hover:bg-gray-100 hover:text-teal-800 block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-teal-500">
            Контакты
          </Link>
          <Link href="/news" className="text-teal-600 hover:bg-gray-100 hover:text-teal-800 block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-teal-500">
            Новости
          </Link>
          <Link href="/education" className="text-teal-600 hover:bg-gray-100 hover:text-teal-800 block px-3 py-2 text-base font-medium border-l-4 border-transparent hover:border-teal-500">
            Образование
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {session ? (
            <div className="flex flex-col px-3 space-y-2">
              <span className="text-gray-700 block px-3 py-2 text-base font-medium">
                {session.user.name}
              </span>
              
              {session.user.role === 'admin' && (
                <Link href="/admin" className="text-white bg-teal-600 hover:bg-teal-700 block px-3 py-2 rounded-md text-base font-medium">
                  Панель админа
                </Link>
              )}
              
              {session.user.role === 'doctor' && (
                <Link href="/doctor" className="text-white bg-teal-600 hover:bg-teal-700 block px-3 py-2 rounded-md text-base font-medium">
                  Мои приемы
                </Link>
              )}
              
              {session.user.role === 'patient' && (
                <Link href="/appointments" className="text-white bg-teal-600 hover:bg-teal-700 block px-3 py-2 rounded-md text-base font-medium">
                  Мои записи
                </Link>
              )}
              
              <button
                onClick={() => signOut()}
                className="text-white bg-red-600 hover:bg-red-500 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Выйти
              </button>
            </div>
          ) : (
            <div className="px-3 space-y-2">
              <Link href="/auth/login" className="text-white bg-teal-600 hover:bg-teal-700 block px-3 py-2 rounded-md text-base font-medium">
                Войти
              </Link>
              <Link href="/auth/register" className="text-white bg-green-600 hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 