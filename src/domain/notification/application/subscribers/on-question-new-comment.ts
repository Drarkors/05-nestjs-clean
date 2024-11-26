import type { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/core/events/domain-events'
import { QuestionNewCommentEvent } from '@/domain/forum/enterprise/events/question-new-comment-event'

export class OnQuestionNewComment implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentEvent.bind(this),
      QuestionNewCommentEvent.name,
    )
  }

  private async sendNewQuestionCommentEvent({
    questionComment,
  }: QuestionNewCommentEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário em "${question.title.substring(0, 40).concat('...')}"`,
        content: questionComment.excerpt,
      })
    }
  }
}
