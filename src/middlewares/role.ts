import { Response , NextFunction} from 'express';
import { AuthRequest } from './auth';
import { errorResponse } from '../utils/response';

export const onlyAdmin = (req : AuthRequest, res : Response, next : NextFunction) => {
    if(req.user?.role !== 'ADMIN') {
        return errorResponse(res, 403, "Akses Ditolak Hanya Admin Yang Boleh Masuk")
    }
    next()
}