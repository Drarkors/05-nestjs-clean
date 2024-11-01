import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { Env } from 'src/env'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private config: ConfigService<Env, true>,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    console.log(this.jwt)

    if (!user) throw new UnauthorizedException('User credentials do not match.')

    const isPasswordValid = compare(password, user.password)

    if (!isPasswordValid)
      throw new UnauthorizedException('User credentials do not match.')

    const privateKey = this.config.get('JWT_PRIVATE_KEY')

    const token = this.jwt.sign(
      { sub: user.id },
      { privateKey: Buffer.from(privateKey, 'base64') },
    )

    return { access_token: token }
  }
}