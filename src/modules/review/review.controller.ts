import { AuthRequest } from "../../middlewares/auth";
import { Response } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import { createReviewService,getReviewByProductService,deleteReviewService } from "./review.service";


export const createReview = async (req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id
        const {productId} = req.params
        const {rating, comment} = req.body

        if(!rating) {
           return errorResponse(res, 400, "Tolong Fileds Rating Product Di Isi")
        }

        const newReview = createReviewService(userId, productId as string, rating, comment)

        return successResponse(res, 201, "Berhasil Menambahkan Review", newReview)

    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}

export const getReviewByProduct = async (req : AuthRequest, res : Response) => {
    try {
        const {productId} = req.params
        const reviews = await getReviewByProductService(productId as string)

        return successResponse(res, 200, "Berhasil Mendapatkan Review Product", reviews)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
        
    }
}

export const deleteReview = async(req : AuthRequest, res : Response) => {
    try {
        const userId = req.user!.id
        const role = req.user!.role
        const {reviewId} = req.params

        await deleteReviewService(reviewId as string, userId, role)

        return successResponse(res, 200, "Berhasil Menghapus Review")
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
        
    }
}