import { natsWrapper } from '../nats-wrapper';
import { randomBytes } from 'crypto'

export const connectToNats = async () => {
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed');
            process.exit();
        })
        process.on('SIGINT',()=> natsWrapper.client.close());
        process.on('SIGTERM',()=> natsWrapper.client.close());
    } catch (error) {
        console.log('we are inside connect to nats');
        console.error(error);
        // console.error(error.message);
    }
}