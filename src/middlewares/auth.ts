import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { errorResponse } from "../utils/response";

export interface AuthRequest extends Request {
    user? :{
        id : string,
        role : string
    }
}


export const authenticate = (req : AuthRequest, res: Response, next:NextFunction) => {
    try {
        const token = req.cookies.token
        if(!token) {
            return errorResponse(res, 401, "Silahkan Login Terlebih Dahulu")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id : string, role : string}
        req.user = decoded
        next()

    } catch (error) {
        return errorResponse(res, 401, "Token Tidak Valid Atau Sudah Expired")
    }
}