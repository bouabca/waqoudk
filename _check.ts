import { prisma } from './src/lib/prisma'
async function main() {
  const rem = await prisma.order.findMany({ select: { id: true, orderNumber: true, status: true, userId: true, driverId: true } })
  console.log('Orders:', JSON.stringify(rem, null, 2))
}
main().catch(console.error).finally(() => prisma.$disconnect())
