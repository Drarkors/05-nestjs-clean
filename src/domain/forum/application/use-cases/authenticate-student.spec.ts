import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students-repository'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from '@/test/factories/make-student'

describe('Authenticate Student', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let fakeHasher: FakeHasher
  let fakeEncrypter: FakeEncrypter

  let sut: AuthenticateStudentUseCase

  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to register a student', async () => {
    const student = makeStudent({
      email: 'johndoe@mail.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@mail.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
