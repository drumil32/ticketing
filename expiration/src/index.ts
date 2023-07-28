import { checkRequiredEnvVariables } from './utils/check-required-env-variables';
import { connectToNats } from './utils/connect-to-nats';

const requiredEnvVariables: string[] = [];
checkRequiredEnvVariables(requiredEnvVariables);
connectToNats();
