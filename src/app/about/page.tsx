'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            О нашей клинике
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Мы стремимся обеспечить высококачественную медицинскую помощь, 
            основанную на индивидуальном подходе к каждому пациенту.
          </p>
        </div>
      </div>

      {/* Миссия и ценности */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Наша миссия</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Качественная медицинская помощь для каждого
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Мы верим в то, что каждый человек заслуживает доступа к высококачественной медицинской помощи, 
              и стремимся сделать ее доступной и эффективной.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Инновации</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Мы используем новейшие технологии и методики для диагностики и лечения, 
                    постоянно совершенствуя наши услуги.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Забота о пациентах</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Мы создаем комфортную и дружелюбную атмосферу, где пациенты чувствуют себя защищенными и окруженными вниманием.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Профессионализм</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Наши врачи — высококвалифицированные специалисты с большим опытом работы, 
                    которые постоянно совершенствуют свои навыки.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Доступность</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Мы стремимся сделать медицинские услуги доступными для всех пациентов, 
                    предлагая гибкую ценовую политику и различные программы лояльности.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* История клиники */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">История</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Путь развития нашей клиники
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-gray-50 text-lg font-medium text-gray-900">2010</span>
            </div>
            <div className="mt-4 mb-10">
              <p className="text-base text-gray-500">
                Основание медицинского центра с небольшой командой врачей, специализирующихся на общей терапии и диагностике.
              </p>
            </div>

            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-gray-50 text-lg font-medium text-gray-900">2015</span>
            </div>
            <div className="mt-4 mb-10">
              <p className="text-base text-gray-500">
                Расширение клиники и открытие специализированных отделений: кардиологии, неврологии и стоматологии.
              </p>
            </div>

            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-gray-50 text-lg font-medium text-gray-900">2018</span>
            </div>
            <div className="mt-4 mb-10">
              <p className="text-base text-gray-500">
                Внедрение электронной системы записи на прием и управления медицинскими картами пациентов.
              </p>
            </div>

            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-gray-50 text-lg font-medium text-gray-900">2020</span>
            </div>
            <div className="mt-4 mb-10">
              <p className="text-base text-gray-500">
                Запуск программы телемедицины, позволяющей пациентам получать консультации врачей онлайн.
              </p>
            </div>

            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-start">
              <span className="pr-3 bg-gray-50 text-lg font-medium text-gray-900">2023</span>
            </div>
            <div className="mt-4">
              <p className="text-base text-gray-500">
                Открытие нового здания клиники с современным оборудованием и расширенным спектром медицинских услуг.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Команда */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Команда</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Наши ведущие специалисты
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Познакомьтесь с нашими ведущими врачами, которые обеспечивают высокое качество медицинской помощи.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            <div className="space-y-4">
              <div className="aspect-w-3 aspect-h-2">
                <div className="relative h-64 w-full">
                  <Image 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="Др. Иванов Иван"
                    fill
                    style={{objectFit: 'cover'}}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-lg leading-6 font-medium space-y-1">
                  <h3>Др. Иванов Иван</h3>
                  <p className="text-blue-600">Главный врач, Кардиолог</p>
                </div>
                <div className="text-base">
                  <p className="text-gray-500">
                    Более 20 лет опыта в кардиологии. Специализируется на лечении сердечно-сосудистых заболеваний.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-w-3 aspect-h-2">
                <div className="relative h-64 w-full">
                  <Image 
                    src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="Др. Петрова Елена"
                    fill
                    style={{objectFit: 'cover'}}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-lg leading-6 font-medium space-y-1">
                  <h3>Др. Петрова Елена</h3>
                  <p className="text-blue-600">Невролог</p>
                </div>
                <div className="text-base">
                  <p className="text-gray-500">
                    Специалист по неврологическим заболеваниям и реабилитации после инсульта.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-w-3 aspect-h-2">
                <div className="relative h-64 w-full">
                  <Image 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="Др. Смирнов Алексей"
                    fill
                    style={{objectFit: 'cover'}}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-lg leading-6 font-medium space-y-1">
                  <h3>Др. Смирнов Алексей</h3>
                  <p className="text-blue-600">Стоматолог</p>
                </div>
                <div className="text-base">
                  <p className="text-gray-500">
                    Эксперт в области стоматологии с опытом работы более 15 лет. Специализируется на имплантологии.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/doctors" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Посмотреть всех специалистов
            </Link>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Готовы записаться на прием?</span>
            <span className="block text-blue-600">Начните заботиться о своем здоровье уже сегодня.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/appointments/new" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Записаться на прием
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/contacts" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50">
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 