import { AuthRequest } from "../../middlewares/auth";
import { Response } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import {
  getNotificationService,
  markAsReadAllService,
  markAsReadService,
  deleteNotificationService,
} from "./notification.service";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = await getNotificationService(userId);

    return successResponse(
      res,
      200,
      "Berhasil Mengambil Semua Notifikasi",
      notifications
    );
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const markAsReadAll = async (req: AuthRequest, res: Response) => {
  try {
    const userId: string = req.user!.id;
    const markAllNotifications = await markAsReadAllService(userId);

    return successResponse(
      res,
      200,
      "Semua Notifikasi Terbaca",
      markAllNotifications
    );
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId: string = req.user!.id;
    const { notificationId } = req.params;

    const readNotification = await markAsReadService(
      userId,
      notificationId as string
    );

    return successResponse(res, 200, "Notifikasi Terbaca", readNotification);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const userId: string = req.user!.id;
    const { notificationId } = req.params;

    await deleteNotificationService(userId, notificationId as string);

    return successResponse(res, 200, "Berhasil Menghapus Notifikasi");
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};
