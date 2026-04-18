import { Gym } from 'generated/prisma'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((u) => u.id === id)

    return gym ?? null
  }
}
