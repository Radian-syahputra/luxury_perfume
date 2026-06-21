import { Router } from "express";
import { getProvinces,getCities,checkOngkir, getDistricts } from "./shipping.controller";

const router = Router()

router.get('/provinces', getProvinces)
router.get('/cities', getCities)
router.get('/districts', getDistricts)
router.post('/check', checkOngkir)

export default router