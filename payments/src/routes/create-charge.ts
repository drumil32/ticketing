import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest, } from "@micro_tickets/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order-schema";
import mongoose from "mongoose";

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

    res.send({success:true});

});

export { router as CreateChargeRouter };