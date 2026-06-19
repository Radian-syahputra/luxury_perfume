import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { onlyAdmin } from "../../middlewares/role";
import { createOrder,getAllOrders,getMyOrder, getOrderById,cancelOrder,updateOrderStatus } from "./order.controller";

const router = Router()

// Customer Route
router.post('/', authenticate, createOrder)
router.get('/my-orders', authenticate, getMyOrder)
router.put('/:orderId/cancel', authenticate, cancelOrder)

router.get('/:id', authenticate, getOrderById)

// Admin
router.get('/', authenticate, onlyAdmin, getAllOrders)
router.put('/:id/status', authenticate, onlyAdmin, updateOrderStatus)

export default router