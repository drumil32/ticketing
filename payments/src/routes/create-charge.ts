import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest, } from "@micro_tickets/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order-schema";
import mongoose from "mongoose";
import { stripe } from "../stripe";
import { Payment } from "../models/payment-schema";
import { PaymentCompeletedPublisher } from "../events/publishers/payment-completed-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post('/api/create-charge', requireAuth, [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty(),
], validateRequest, async (req: Request, res: Response) => {
    const {token,orderId} = req.body;

    const isValidId = mongoose.Types.ObjectId.isValid(orderId);
    if (false === isValidId) {
        throw new BadRequestError('given ticket id is not valid');
    }

    const order = await Order.findById(orderId);

    if( !order ){
        throw new NotFoundError('order with the given id is not found');
    }

    if( order.userId!==req.currentUser.id ){
        throw new NotAuthorizedError();
    }

    if( order.status===OrderStatus.Cancelled ){
        throw new BadRequestError('cannot pay for cancelled order')
    }

    const charge = stripe.charges.create({
        currency:'usd',
        amount: order.price*100,
        source:token
    });

    // const payment = Payment.build({orderId,stripeId:charge.id});
    const payment = Payment.build({orderId,stripeId:new mongoose.Types.ObjectId().toHexString()});
    await payment.save();
    await new PaymentCompeletedPublisher(natsWrapper.client).publish({
        id: payment.stripeId,
        orderId : payment.orderId
    });
    res.status(201).send({payment});
});

export { router as CreateChargeRouter };