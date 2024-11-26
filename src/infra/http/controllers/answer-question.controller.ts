import { z } from 'zod'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Param('questionId') questionId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe)
    body: AnswerQuestionBodySchema,
  ) {
    const { sub: userId } = user
    const { content } = body

    const result = await this.answerQuestion.execute({
      questionId,
      content,
      authorId: userId,
      attachmentsIds: [],
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
