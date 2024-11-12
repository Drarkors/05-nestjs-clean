import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    const config = moduleRef.get(ConfigService)

    console.log('BD:', config.get('DATABASE_URL'))

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    console.log(response.body)
    expect(response.statusCode).toEqual(201)

    const userOnDatabae = await prisma.user.findUnique({
      where: {
        email: 'johndoe@email.com',
      },
    })

    expect(userOnDatabae).toBeTruthy()
  })
})
