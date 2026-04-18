import { Prisma, CheckIn } from 'generated/prisma'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins.repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  private items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const checkOnSameDate = this.items.find(checkIn => checkIn.user_id === userId)

    if (!checkOnSameDate) {
      return null
    }

    return checkOnSameDate
  }
}
