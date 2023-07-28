import { Publisher, Subjects, OrderCreatedEvent } from "@micro_tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}
