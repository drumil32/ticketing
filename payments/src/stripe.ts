import mongoose from 'mongoose';
import Stripe from 'stripe';

export const stripe = {
    charges : {
        create: function(data:{currency:string,amount:number,source:string}){
            console.log('we are here');
            const temp = {id:new mongoose.Types.ObjectId().toHexString()};
            console.log(temp)
            return temp;
        }
    }
}