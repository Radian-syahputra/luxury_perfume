import { AuthRequest } from "../../middlewares/auth";
import { Response } from "express";
import { OrderStatus } from "../../generated/prisma/enums";
import { successResponse, errorResponse } from "../../utils/response";
import { createOrderService,getAllOrdersService,getMyOrderService,getOrderByIdService,cancelOrderService,updateOrderStatusService } from "./order.service";


export const createOrder = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id
        const {shippingAddress } = req.body

        if(!shippingAddress) {
            return errorResponse(res, 400, "Alamat Wajib Di Isi")
        }

        const order = await createOrderService(userId, shippingAddress)
        return successResponse(res, 201, "Berhasil Membuat Order", order)

    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}

export const getMyOrder = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id

        const orders = await getMyOrderService(userId)
        return successResponse(res, 200 , "Berhasil Mengambil Semua Order Anda", orders)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
        
    }
}

export const getAllOrders = async (req : AuthRequest, res : Response) => {
    try {
        const orders = await getAllOrdersService()

        return successResponse(res, 200, "Berhasil Mengambil Semua Order", orders)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
        
    }
}

export const getOrderById = async (req : AuthRequest, res : Response) => {
    try {
        const {id} = req.params
        
        const order = await getOrderByIdService(id as string)

        return successResponse(res, 200, "Berhasil Mengambil Order", order)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}

export const updateOrderStatus = async (req : AuthRequest, res : Response) => {
    try {
        const {id} = req.params
        const {status, trackingNumber} = req.body

        if(!status) {
            return errorResponse(res, 400, "Status Harus Di isi")
        }

        const updated = await updateOrderStatusService(id as string, status as OrderStatus, trackingNumber)
        return successResponse(res, 200, "Berhasil Mengubah Status", updated)

    } catch (error : any) {
        return errorResponse(res, 400, error.message)
        
    }
}

export const cancelOrder = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id
        const {orderId} = req.params

        const cancel = await cancelOrderService(userId, orderId as string)

        return successResponse(res, 200, "Berhasil Membatalkan Pesanan", cancel)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
        
    }
}