import bcryptjs from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { UpdateUserInput } from './user.schema';

const { hash } = bcryptjs;

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export class UserService {
  async findAll() {
    return prisma.user.findMany({ select: userSelect });
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    await this.findById(id);

    const updateData: Record<string, unknown> = { ...data };

    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.user.delete({ where: { id } });
  }
}
