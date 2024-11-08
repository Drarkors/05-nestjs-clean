import type { DomainEvent } from '@/core/events/domain-event'
import type { QuestionComment } from '../entities/question-comment'

export class QuestionNewCommentEvent implements DomainEvent {
  public ocurredAt: Date
  public questionComment: QuestionComment

  getAggregateId() {
    return this.questionComment.questionId
  }

  constructor(questionComment: QuestionComment) {
    this.questionComment = questionComment
    this.ocurredAt = new Date()
  }
}
