import { z } from 'zod'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  private convertToSlug(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // replaces all(/g) whitespaces (\s+) with dashes "-"
      .replace(/[^\w-]+/g, '') // removes all(/g) non(^) words ([\w-]+)
      .replace(/_+/g, '-') // replaces all(/g) underlines(/_+) with dashes "-"
      .replace(/--+/g, '-') // replaces all(/g) double dashes (/--) with one dash "-" (may be caused by the underline replacement)
      .replace(/-$/, '') // removes all(/g) dash(/-) at the end($) of our string (eg.: removing-ending-dash-)

    return slugText
  }

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe)
    body: CreateQuestionBodySchema,
  ) {
    const { sub: userId } = user
    const { title, content } = body

    const slug = this.convertToSlug(title)

    await this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: userId,
      },
    })

    return 'ok'
  }
}
