import { Publisher,ExpirationCompeletedEvent, Subjects } from "@micro_tickets/common";


export class ExpirationCompeletedPublisher extends Publisher<ExpirationCompeletedEvent> {
    readonly subject = Subjects.ExpirationCompleted;
}