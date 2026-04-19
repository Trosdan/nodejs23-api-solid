import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Use Case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository)
  })

  it('Should be able to search for gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    })
    await inMemoryGymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: 100,
      longitude: 100,
    })

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
