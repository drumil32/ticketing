import { OrderCreatedListener } from "../events/listeners/order-created-listener";
import { natsWrapper } from "../nats-wrapper";

export const initializeListeners = () => {
    new OrderCreatedListener(natsWrapper.client).listen();
}