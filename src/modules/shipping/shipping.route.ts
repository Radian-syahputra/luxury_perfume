import { Router } from "express";
import { getProvinces,getCities,checkOngkir, getDistricts, trackResi } from "./shipping.controller";

const router = Router()

router.get('/provinces', getProvinces)
router.get('/cities', getCities)
router.get('/districts', getDistricts)
router.post('/check', checkOngkir)
router.post('/track', trackResi)

export default router