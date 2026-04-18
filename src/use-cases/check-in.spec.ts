import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repositroy'
import { expect, describe, it, beforeEach } from 'vitest'
import { CheckInUseCase } from './check-in'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository)
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })
    
    expect(checkIn.id).toEqual(expect.any(String))
  })
})
