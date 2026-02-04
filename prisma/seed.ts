import { PrismaClient, Role, Belt } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    //const password = await hash('admin123', 12)
    const password = '$2a$12$DvTiuohvE31Iya0xVau7xu2qnb4lsmzEN2Nmwk5x9zcyAFAq0GLQu';
    const user = await prisma.user.upsert({
        where: { email: 'admin@blackbelt.com' },
        update: {},
        create: {
            email: 'admin@blackbelt.com',
            name: 'Mestre Admin',
            password,
            role: Role.ADMIN,
            belt: Belt.BLACK,
            beltDegree: 4,
            startDate: new Date('2010-01-01'),
            status: true,
            history: 'Fundador do sistema.',
        },
    })
    console.log({ user })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
