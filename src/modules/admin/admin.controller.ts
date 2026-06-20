import { Response } from "express"
import { AuthRequest } from "../../middlewares/auth"
import { successResponse, errorResponse } from "../../utils/response"
import { Role } from "../../generated/prisma/enums"
import { 
    getDashboardStatsService,
    getAllUsersService,
    updateUserRoleService,
    deleteUserService
} from "./admin.service"


export const getDashboardStats = async (req : AuthRequest, res : Response) => {
    try {
        const dashboardStats = await getDashboardStatsService()

        return successResponse(res, 200, "Berhasil Mendapatkan Data Dashboard", dashboardStats)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}

export const getAllUsers = async (req : AuthRequest, res : Response) => {
    try {
        const users = await getAllUsersService()

        return successResponse(res, 200, "Berhasil Mengambil Data User", users)
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}

export const updateUserRole = async (req : AuthRequest, res : Response) => {
    try {
        const {userId}  = req.params 
        const {role} = req.body

        if(!role ){
            return errorResponse(res, 400, "Fileds Role Harus Disis")
        }

        const updated = await updateUserRoleService(userId as string, role as Role)

        return successResponse(res, 200, "Berhasil Mengubah Role User", updated)

    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}

export const deleteUser = async (req : AuthRequest, res :Response) => {
    try {
        const {userId} = req.params

        await deleteUserService(userId as string)

        return successResponse(res, 200, "Berhasil Menghapus User")
    } catch (error : any) {
        return errorResponse(res, 400, error.message)
    }
}