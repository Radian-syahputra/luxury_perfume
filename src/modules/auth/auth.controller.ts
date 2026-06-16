import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth";
import { successResponse, errorResponse } from "../../utils/response";
import { registerService, getMeService, loginService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return errorResponse(res, 400, "Semua Fields Atau Inputan Harus Di Isi");
    }

    const user = await registerService(name, email, password);

    return successResponse(res, 201, "Berhasil Register", user);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 400, "Semua Fileds Atau Inputan Harus Di Isi");
    }

    const { currentUser, token } = await loginService(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, "Berhasil Login", currentUser);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return successResponse(res, 200, "Berhasil Logout");
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await getMeService(userId);

    return successResponse(res, 200, "Berhasil Mengabil Data User", user);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};
