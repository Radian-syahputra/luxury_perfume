import { onlyAdmin } from "../../middlewares/role";
import { authenticate } from "../../middlewares/auth";
import { Router } from "express";
import { getDashboardStats, getAllUsers, updateUserRole, deleteUser } from "./admin.controller";

const router = Router()

router.get('/dashboard', authenticate, onlyAdmin, getDashboardStats)
router.get('/users', authenticate, onlyAdmin, getAllUsers)
router.put('/users/:userId/role', authenticate, onlyAdmin, updateUserRole)
router.delete('/users/:userId', authenticate, onlyAdmin, deleteUser)

export default router