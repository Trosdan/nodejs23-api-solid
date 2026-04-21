import { prisma } from '@/lib/prisma'
import { Prisma, User } from '../../../generated/prisma'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    })
  }
}
