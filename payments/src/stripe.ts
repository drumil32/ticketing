import mongoose from 'mongoose';
import Stripe from 'stripe';

export const stripe = {
    charges : {
        create: function(data:{currency:string,amount:number,source:string}){
            const temp = {id:new mongoose.Types.ObjectId().toHexString()};
            return temp;
        }
    }
}