import { PaymentCompeletedEvent, Publisher, Subjects } from "@micro_tickets/common";

export class PaymentCompeletedPublisher extends Publisher<PaymentCompeletedEvent>{
    readonly subject = Subjects.PaymentCompleted;
    
}