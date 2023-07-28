import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedListener } from "../events/listeners/order-created-listener";
import { OrderCancelledListener } from "../events/listeners/order-cancelled-listener";

export const initializeListeners = () => {
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
}