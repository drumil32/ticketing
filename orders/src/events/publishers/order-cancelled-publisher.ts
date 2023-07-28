import { Publisher, Subjects, OrderCancelledEvent } from "@micro_tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
