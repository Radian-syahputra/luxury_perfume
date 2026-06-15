import { Response } from "express"

export const successResponse = (res : Response  , statusCode : number = 200, message : string, data : any = null) => {
    return res.status(statusCode).json({
        success : true,
        message : message,
        data : data
    })
}


export const errorResponse  = (res : Response, statusCode : number = 400, message : string) => {
    return res.status(statusCode).json({
        success : false,
        message : message,
        data : null
    })
}