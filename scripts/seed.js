const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Ошибка: MONGODB_URI не указан в .env.local');
  process.exit(1);
}

const client = new MongoClient(uri);

async function seedDatabase() {
  try {
    console.log('Подключение к базе данных...');
    await client.connect();
    console.log('Подключение успешно установлено');
    
    const database = client.db('medclinic');
    
    // Очистка коллекций перед заполнением
    console.log('Очистка коллекций...');
    await database.collection('services').deleteMany({});
    console.log('Коллекция услуг очищена');
    
    // Заполнение коллекции услуг
    console.log('Добавление тестовых услуг...');
    const services = [
      {
        name: 'Консультация терапевта',
        description: 'Первичный прием врача-терапевта с осмотром и выдачей рекомендаций по лечению. Включает сбор анамнеза, измерение давления и общий осмотр.',
        price: 2000,
        duration: 30,
        category: 'Терапия',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Консультация кардиолога',
        description: 'Консультация врача-кардиолога с проведением ЭКГ и расшифровкой результатов. Оценка состояния сердечно-сосудистой системы и выдача рекомендаций.',
        price: 2500,
        duration: 45,
        category: 'Кардиология',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'УЗИ сердца',
        description: 'Ультразвуковое исследование сердца (эхокардиография) для оценки структуры и функции сердца. Позволяет выявить патологические изменения.',
        price: 3500,
        duration: 60,
        category: 'Кардиология',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Консультация невролога',
        description: 'Диагностика и лечение заболеваний нервной системы. Консультация включает тесты неврологического статуса и выдачу рекомендаций.',
        price: 2300,
        duration: 40,
        category: 'Неврология',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Лечение кариеса',
        description: 'Лечение кариеса с установкой пломбы световой полимеризации. Включает препарирование полости, удаление пораженных тканей и пломбирование.',
        price: 4500,
        duration: 60,
        category: 'Стоматология',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Чистка зубов',
        description: 'Профессиональная чистка зубов с использованием ультразвука и полировки. Удаление зубного камня и налета для профилактики заболеваний.',
        price: 5000,
        duration: 60,
        category: 'Стоматология',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Анализ крови общий',
        description: 'Общий анализ крови с расшифровкой результатов. Исследование включает определение уровня гемоглобина, эритроцитов, лейкоцитов и других показателей.',
        price: 900,
        duration: 15,
        category: 'Лабораторные исследования',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'МРТ головного мозга',
        description: 'Магнитно-резонансная томография головного мозга. Высокоточное исследование для диагностики патологий головного мозга.',
        price: 7500,
        duration: 45,
        category: 'Диагностика',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const result = await database.collection('services').insertMany(services);
    console.log(`Добавлено ${result.insertedCount} услуг`);
    
    // Проверка, существует ли уже администратор
    const adminExists = await database.collection('users').findOne({ email: 'admin@medclinic.ru' });
    
    if (!adminExists) {
      console.log('Создание администратора...');
      // Хешируем пароль для админа
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin123', salt);
      
      // Добавляем администратора
      const admin = {
        email: 'admin@medclinic.ru',
        password: hashedPassword,
        firstName: 'Администратор',
        lastName: 'Системы',
        role: 'admin',
        phoneNumber: '+79001234567',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await database.collection('users').insertOne(admin);
      console.log('Администратор создан');
      console.log('Логин: admin@medclinic.ru');
      console.log('Пароль: Admin123');
    } else {
      console.log('Администратор уже существует');
    }
    
    // Создание тестового врача
    const doctorExists = await database.collection('users').findOne({ email: 'doctor@medclinic.ru' });
    
    if (!doctorExists) {
      console.log('Создание тестового врача...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Doctor123', salt);
      
      const doctor = {
        email: 'doctor@medclinic.ru',
        password: hashedPassword,
        firstName: 'Иван',
        lastName: 'Петров',
        role: 'doctor',
        phoneNumber: '+79002223344',
        doctorSpecialty: 'Кардиология',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await database.collection('users').insertOne(doctor);
      console.log('Тестовый врач создан');
      console.log('Логин: doctor@medclinic.ru');
      console.log('Пароль: Doctor123');
    } else {
      console.log('Тестовый врач уже существует');
    }
    
    // Создание тестового пациента
    const patientExists = await database.collection('users').findOne({ email: 'patient@example.com' });
    
    if (!patientExists) {
      console.log('Создание тестового пациента...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Patient123', salt);
      
      const patient = {
        email: 'patient@example.com',
        password: hashedPassword,
        firstName: 'Мария',
        lastName: 'Иванова',
        role: 'patient',
        phoneNumber: '+79003334455',
        dateOfBirth: new Date('1990-05-15'),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await database.collection('users').insertOne(patient);
      console.log('Тестовый пациент создан');
      console.log('Логин: patient@example.com');
      console.log('Пароль: Patient123');
    } else {
      console.log('Тестовый пациент уже существует');
    }
    
    console.log('База данных успешно заполнена тестовыми данными');
  } catch (error) {
    console.error('Ошибка при заполнении базы данных:', error);
  } finally {
    await client.close();
    console.log('Подключение к базе данных закрыто');
  }
}

seedDatabase().catch(console.error); 