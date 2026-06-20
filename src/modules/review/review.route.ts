import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { createReview,getReviewByProduct, deleteReview } from "./review.controller";

const router = Router()

router.post('/:productId/add', authenticate, createReview)
router.get('/:productId', getReviewByProduct)
router.delete('/:reviewId/delete', authenticate, deleteReview )

export default router