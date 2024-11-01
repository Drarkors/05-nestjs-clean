import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, password, email } = body

    const userWithSameEmai = !!this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmai) {
      throw new UnprocessableEntityException(
        'E-mail already exists on another user.',
      )
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }
}
