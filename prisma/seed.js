const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    const password = '$2a$12$DvTiuohvE31Iya0xVau7xu2qnb4lsmzEN2Nmwk5x9zcyAFAq0GLQu';

    // Check if user exists first to avoid errors if unique constraint fails on upsert weirdly or just for logging
    const existing = await prisma.user.findUnique({ where: { email: 'admin@blackbelt.com' } });

    if (existing) {
        console.log('User admin@blackbelt.com already exists.');
        // Optional: update password if needed
        // const updated = await prisma.user.update({
        //     where: { email: 'admin@blackbelt.com' },
        //     data: {
        //         password,
        //         role: 'ADMIN',
        //         status: true
        //     }
        // });
        // console.log('User updated:', updated.email);
    } else {
        const user = await prisma.user.create({
            data: {
                email: 'admin@blackbelt.com',
                name: 'Mestre Admin',
                password,
                role: 'ADMIN',
                belt: 'BLACK',
                beltDegree: 4,
                startDate: new Date('2010-01-01'),
                status: true,
                history: 'Fundador do sistema.',
            },
        });
        console.log('User created:', user);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
