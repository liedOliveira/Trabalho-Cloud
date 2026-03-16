import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();
const { hash } = bcryptjs;

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // --- Criar Usuários ---
  const adminPassword = await hash('admin123', 10);
  const clientPassword = await hash('cliente123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@agendapro.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@agendapro.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: 'maria@email.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'maria@email.com',
      password: clientPassword,
      role: 'CLIENT',
    },
  });

  const carlos = await prisma.user.upsert({
    where: { email: 'carlos@email.com' },
    update: {},
    create: {
      name: 'Carlos Lima',
      email: 'carlos@email.com',
      password: clientPassword,
      role: 'CLIENT',
    },
  });

  console.log('✅ Usuários criados:', { admin: admin.email, maria: maria.email, carlos: carlos.email });

  // --- Criar Agendamentos ---
  const appointmentsData = [
    {
      title: 'Consultoria de Marketing',
      description: 'Reunião para definir estratégia digital',
      date: new Date('2026-04-01T10:00:00Z'),
      status: 'CONFIRMED' as const,
      userId: maria.id,
    },
    {
      title: 'Sessão de Design',
      description: 'Criação de identidade visual',
      date: new Date('2026-04-03T14:00:00Z'),
      status: 'PENDING' as const,
      userId: carlos.id,
    },
    {
      title: 'Aula de Fotografia',
      description: 'Workshop de fotografia de produto',
      date: new Date('2026-04-05T09:00:00Z'),
      status: 'PENDING' as const,
      userId: maria.id,
    },
    {
      title: 'Mentoria de Negócios',
      description: 'Sessão de coaching empresarial',
      date: new Date('2026-04-10T16:00:00Z'),
      status: 'PENDING' as const,
      userId: carlos.id,
    },
  ];

  for (const data of appointmentsData) {
    await prisma.appointment.create({ data });
  }

  console.log(`✅ ${appointmentsData.length} agendamentos criados`);
  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('   Admin:   admin@agendapro.com  / admin123');
  console.log('   Cliente: maria@email.com      / cliente123');
  console.log('   Cliente: carlos@email.com     / cliente123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
