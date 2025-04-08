'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Если пользователь не аутентифицирован и загрузка сессии завершена
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    
    // Если пользователь аутентифицирован, но не имеет нужной роли
    if (status === 'authenticated' && 
        allowedRoles.length > 0 && 
        !allowedRoles.includes(session?.user?.role)) {
      router.push('/');
    }
  }, [status, session, router, allowedRoles]);
  
  // Показываем загрузку, пока проверяем сессию
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Если нет ролей для проверки или роль пользователя подходит, показываем контент
  if (status === 'authenticated' && 
      (allowedRoles.length === 0 || allowedRoles.includes(session?.user?.role))) {
    return <>{children}</>;
  }
  
  // По умолчанию ничего не показываем
  return null;
} 