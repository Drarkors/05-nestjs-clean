import { AggregateRoot } from '../entities/aggregate-root'
import type { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId() {
    return this.aggregate.id
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscribing event (listening to events)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Creating a response, without saving it
    const aggregate = CustomAggregate.create()

    // Verifying that an event was created but not triggered
    expect(aggregate.domainEvents).toHaveLength(1)

    // Simulating event dispatch after saving aggregate
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // After the event is dispatched, the listener should have been called (callback) and was processed
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
