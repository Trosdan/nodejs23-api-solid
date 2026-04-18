import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repositroy'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })
    
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    await expect(() => sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })).rejects.toBeInstanceOf(Error)
  })

  it('Should be able to check in in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
    })
    
    expect(checkIn.id).toEqual(expect.any(String))
  })
})
