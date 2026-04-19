import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repositroy'
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository, inMemoryGymsRepository)
    await inMemoryGymsRepository.create({
      id: 'gym-1',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-1',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to check in in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-1',
      gymId: 'gym-1',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check in on distant gym', async () => {
    inMemoryGymsRepository.items.push({
      id: 'gym-2',
      title: 'JavaScript Gym',
      description: '',
      phone: null,
      latitude: new Decimal(100),
      longitude: new Decimal(100),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-1',
        gymId: 'gym-2',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
