import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedListener } from "../events/listeners/order-created-listener";
import { OrderCancelledListener } from "../events/listeners/order-cancelled-listener";

export const initializeListeners = () => {
    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
}