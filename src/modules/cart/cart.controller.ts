import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { successResponse, errorResponse } from "../../utils/response";
import { getCartService,addToCartService,updateCartItemService, removeCartItemService,clearCartService } from "./cart.service";


export const getCart = async (req : AuthRequest, res : Response) => {
    try {
        const id = req.user!.id as string

        const cart = await getCartService(id)

        return successResponse(res, 200, "Berhasil Mengambil Data Cart", cart)

    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}


export const addToCart = async (req :AuthRequest, res : Response) => {
    try {
        const id = req.user!.id as string
        const {variantId, quantity} = req.body
        if(!variantId || !quantity) {
            return errorResponse(res, 400, "Variant Id Dan Quantity Wajib Di isi")
        }

        const cart = await addToCartService(id, variantId, quantity)

        return successResponse(res, 201, "Berhasil Menambahkan Ke Cart", cart)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
        
    }
}

export const updateCartItem = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id
        const {cartItemId} = req.params
        const {quantity} = req.body 

        if(!quantity) {
            return errorResponse(res, 400, "Semua Fields Harus Di isi")
        }

        const updated= await updateCartItemService(userId, cartItemId as string, quantity)
        
        return successResponse(res, 200, "Berhasil Update Cart Item", updated)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
        
    }
}

export const removeCartItem = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id as string
        const {cartItemId} = req.params

        await removeCartItemService(userId, cartItemId as string)

        return successResponse(res, 200, "Berhasil Menghapus Cart Item")
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}

export const clearCart = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id as string
        
        await clearCartService(userId)

        return successResponse(res, 200, "Berhasil Menghapus Semua Cart")
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}