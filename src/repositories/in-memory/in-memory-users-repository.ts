import { User, Prisma } from 'generated/prisma'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = []

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id)

    return user ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email)

    return user ?? null
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}
