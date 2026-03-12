import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { CreateAppointmentInput, UpdateAppointmentInput } from './appointment.schema';

export class AppointmentService {
  async create(data: CreateAppointmentInput, userId: string) {
    return prisma.appointment.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        userId,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAll(userId?: string) {
    const where = userId ? { userId } : {};
    return prisma.appointment.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { date: 'asc' },
    });
  }

  async findById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!appointment) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    return appointment;
  }

  async update(id: string, data: UpdateAppointmentInput) {
    await this.findById(id);

    const updateData: Record<string, unknown> = { ...data };
    if (data.date) {
      updateData.date = new Date(data.date);
    }

    return prisma.appointment.update({
      where: { id },
      data: updateData,
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.appointment.delete({ where: { id } });
  }
}
