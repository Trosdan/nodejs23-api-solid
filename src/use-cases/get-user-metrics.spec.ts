import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repositroy'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get user metrics Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(inMemoryCheckInsRepository)
  })

  it('Should be able to get check-ins count from metrics', async () => {
    await inMemoryCheckInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await inMemoryCheckInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
