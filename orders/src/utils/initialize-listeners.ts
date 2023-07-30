import { ExpirationCompeletedListener } from "../events/listeners/expiration-completed-listener";
import { PaymentCompeletedListener } from "../events/listeners/payment-completed-listener";
import { TicketCreatedListener } from "../events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "../events/listeners/ticket-updated-listener";
import { natsWrapper } from "../nats-wrapper";

export const initializeListeners = () => {
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompeletedListener(natsWrapper.client).listen();
    new PaymentCompeletedListener(natsWrapper.client).listen();
}