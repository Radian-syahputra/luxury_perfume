import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { onlyAdmin } from "../../middlewares/role";
import { 
    createProduct, getAllProducts, getProductById, 
    updateProduct, deleteProduct,
    createVariant, getVariantByProductId,
    updateVariant, deleteVariant
} from "./product.controller"
import upload from "../../config/multer";

const router = Router()

// Public Route
router.get("/", getAllProducts)
router.get('/:id', getProductById)


// Admin Route
router.post('/', authenticate, onlyAdmin, upload.single('image'), createProduct)
router.put('/:id', authenticate, onlyAdmin, upload.single('image'), updateProduct)
router.delete('/:id', authenticate, onlyAdmin, deleteProduct)


// =========================================================== Variant Route ==============================================================

// Admin Route
router.post('/:productId/variants', authenticate, onlyAdmin, createVariant)
router.put('/variants/:id', authenticate,onlyAdmin, updateVariant)
router.delete('/variants/:id', authenticate, onlyAdmin, deleteVariant)

// Public Route
router.get('/:productId/variants', getVariantByProductId)

export default router