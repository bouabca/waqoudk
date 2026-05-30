import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.spoejmoiyskdwroghgbv:%40Wa9odok2026@aws-0-eu-west-1.pooler.supabase.com:5432/postgres'
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

async function main() {
  const user1 = await prisma.user.upsert({
    where: { phone: '0512345678' },
    update: {},
    create: {
      id: 'user-1',
      name: 'أحمد علي عيض',
      phone: '0512345678',
      email: 'ahmed@example.com',
      password: '123456',
      accountType: 'user',
      category: 'فلاح',
      address: 'سيدي بلعباس',
      avatar: '/icons/user.svg',
      isVerified: true,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { phone: '0598765432' },
    update: {},
    create: {
      id: 'user-2',
      name: 'محمد بن صالح',
      phone: '0598765432',
      email: 'mohamed@example.com',
      password: '123456',
      accountType: 'user',
      category: 'ورشةبناء',
      address: 'سيدي بلعباس',
      avatar: '/icons/user.svg',
      isVerified: true,
    },
  })

  const drivers = [
    { id: 'driver-1', name: 'علي بن أحمد', phone: '0555123456', email: 'ali.driver@example.com', lat: 35.1938, lng: 0.6391, rating: 4.8 },
    { id: 'driver-2', name: 'خالد بن عمر', phone: '0555987654', email: 'khalid.driver@example.com', lat: 35.1960, lng: 0.6420, rating: 4.7 },
    { id: 'driver-3', name: 'سعيد بن محمد', phone: '0555777888', email: 'saeed.driver@example.com', lat: 35.1920, lng: 0.6370, rating: 4.5 },
  ]

  const driverIds: string[] = []
  for (const d of drivers) {
    const driver = await prisma.user.upsert({
      where: { phone: d.phone },
      update: {},
      create: {
        id: d.id,
        name: d.name,
        phone: d.phone,
        email: d.email,
        password: '123456',
        accountType: 'livreur',
        address: 'سيدي بلعباس',
        isVerified: true,
        isAvailable: true,
        rating: d.rating,
        lat: d.lat,
        lng: d.lng,
      },
    })
    driverIds.push(driver.id)
  }

  const existing1 = await prisma.order.findUnique({ where: { id: 'order-1' } })
  if (!existing1) {
    await prisma.order.create({
      data: {
        id: 'order-1',
        orderNumber: '#2024-1056',
        status: 'in_progress',
        totalPrice: 6700,
        itemPrice: 6200,
        deliveryFee: 500,
        discount: 0,
        quantity: 200,
        address: 'سيدي بلعباس - مزرعة',
        lat: 35.1948,
        lng: 0.6401,
        category: 'فلاح',
        driverId: driverIds[0],
        driverName: 'علي بن أحمد',
        driverRating: 4.8,
        driverPhone: '0555123456',
        userId: user1.id,
      },
    })
  }

  const existing2 = await prisma.order.findUnique({ where: { id: 'order-2' } })
  if (!existing2) {
    await prisma.order.create({
      data: {
        id: 'order-2',
        orderNumber: '#2024-1057',
        status: 'completed',
        totalPrice: 4200,
        itemPrice: 3800,
        deliveryFee: 400,
        discount: 0,
        quantity: 120,
        address: 'سيدي بلعباس - ورشة',
        lat: 35.1969,
        lng: 0.6433,
        category: 'ورشةبناء',
        driverId: driverIds[1],
        driverName: 'خالد بن عمر',
        driverRating: 4.7,
        driverPhone: '0555987654',
        userId: user2.id,
        isRated: true,
        rating: 5,
        review: 'خدمة ممتازة وسريعة جداً',
        completedAt: new Date(),
      },
    })
  }

  const stations = [
    { id: 'station-1', name: 'محطة نفط سيدي بلعباس', location: 'سيدي بلعباس', lat: 35.1948, lng: 0.6401, phone: '+213491234567', hours: '24/24', currentPrice: 31, logo: '/icons/fuel.svg' },
    { id: 'station-2', name: 'محطة نفط وهران', location: 'وهران', lat: 35.6969, lng: -0.6333, phone: '+213491234568', hours: '06:00-22:00', currentPrice: 32, logo: '/icons/fuel.svg' },
    { id: 'station-3', name: 'محطة نفط الجزائر العاصمة', location: 'الجزائر العاصمة', lat: 36.7538, lng: 3.0588, phone: '+213491234569', hours: '24/24', currentPrice: 30, logo: '/icons/fuel.svg' },
  ]

  for (const station of stations) {
    const existing = await prisma.station.findUnique({ where: { id: station.id } })
    if (!existing) {
      await prisma.station.create({ data: station })
    }
  }

  console.log('Seed completed successfully')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
