import { connectToDB } from './utils/connect-to-db';
import { checkRequiredEnvVariables } from './utils/check-required-env-variables';
import { app } from './app';

const requiredEnvVariables = ['JWT_SIGN', 'MONGO_URI'];
checkRequiredEnvVariables(requiredEnvVariables);
connectToDB();


app.listen(3000,()=>{
    console.log('auth is listening on port 3000!!!');
});