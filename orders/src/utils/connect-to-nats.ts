import { natsWrapper } from '../nats-wrapper';
import { initializeListeners } from './initialize-listeners';

export const connectToNats = async () => {
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed');
            process.exit();
        })
        initializeListeners();
        process.on('SIGINT',()=> natsWrapper.client.close());
        process.on('SIGTERM',()=> natsWrapper.client.close());
    } catch (error) {
        console.error(error);
    }
}