import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { Comment, type CommentProps } from './comment'
import { QuestionNewCommentEvent } from '../events/question-new-comment-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )

    const isNewComment = !id

    if (isNewComment)
      questionComment.addDomainEvent(
        new QuestionNewCommentEvent(questionComment),
      )

    return questionComment
  }
}