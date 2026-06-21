import { Request, Response } from "express";
import { successResponse, errorResponse } from "../../utils/response";
import {
  getProvincesService,
  checkOngkirService,
  getCitiesService,
  getDistrictsService
} from "./shipping.service";

export const getProvinces = async (req: Request, res: Response) => {
  try {
    const province = await getProvincesService();

    return successResponse(res, 200, "Berhasil Mengambil Provinsi", province);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};

export const getCities = async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.query;

    const city = await getCitiesService(provinceId as string);
    return successResponse(res, 200, "Kota Ditemukan", city);
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};


export const getDistricts = async (req : Request, res : Response) => {
    try {
        const {cityId} = req.query

        const districts = await getDistrictsService(cityId as string)

        return successResponse(res, 200, "Berhasil Mendapatkan Kecamatan", districts)
    } catch (error : any) {
    return errorResponse(res, 400, error.message);
        
    }
}


export const checkOngkir = async (req: Request, res: Response) => {
  try {
    const { origin, destination, weight, courier } = req.body;
    if (!origin || !destination || !weight || !courier) {
      return errorResponse(res, 400, "Semua Fileds Wajib Disi");
    }

    const ongkir = await checkOngkirService(
      origin,
      destination,
      weight,
      courier
    );

    return successResponse(
      res,
      200,
      "Berhasil Mendapatkan Total Ongkir",
      ongkir
    );
  } catch (error: any) {
    return errorResponse(res, 400, error.message);
  }
};
