import { Publisher,ExpirationCompletedEvent, Subjects } from "@micro_tickets/common";


export class ExpirationCompeletedPublisher extends Publisher<ExpirationCompletedEvent> {
    readonly subject = Subjects.ExpirationCompleted;
}