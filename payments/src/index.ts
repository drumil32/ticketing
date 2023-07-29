import { connectToDB } from './utils/connect-to-db';
import { checkRequiredEnvVariables } from './utils/check-required-env-variables';
import { app } from './app';
import { connectToNats } from './utils/connect-to-nats';

const requiredEnvVariables = ['JWT_SIGN', 'MONGO_URI','NATS_URL','NATS_CLIENT_ID','NATS_CLUSTER_ID'];
checkRequiredEnvVariables(requiredEnvVariables);
connectToDB();
connectToNats();

app.listen(3000,()=>{
    console.log('ticket is listening on port 3000!!!');
});