import { Publisher, Subjects, TicketUpdatedEvent } from "@micro_tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}