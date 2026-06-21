import axios from "axios";

const rajaOngkirApi = axios.create({
    baseURL: process.env.RAJAONGKIR_BASE_URL,
    headers: {
        key: process.env.RAJAONGKIR_API_KEY
    }
})

export const getProvincesService = async () => {
    const response = await rajaOngkirApi.get('/destination/province')
    return response.data
}

export const getCitiesService = async (provinceId: string) => {
    const response = await rajaOngkirApi.get(`/destination/city/${provinceId}`)
    return response.data
}

export const getDistrictsService = async (cityId: string) => {
    const response = await rajaOngkirApi.get(`/destination/district/${cityId}`)
    return response.data
}

export const checkOngkirService = async (
    origin: string,
    destination: string,
    weight: number,
    courier: string
) => {
    // pakai form-urlencoded bukan JSON
    const params = new URLSearchParams()
    params.append('origin', origin)
    params.append('destination', destination)
    params.append('weight', weight.toString())
    params.append('courier', courier)

    const response = await rajaOngkirApi.post(
        '/calculate/district/domestic-cost',
        params,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )
    return response.data
}

export const trackingService  = async (awb :string, courier : string, lastPhoneNumber : string) => {
    const response = await rajaOngkirApi.post(`/track/waybill?awb=${awb}&courier=${courier}`,
        {last_phone_number: lastPhoneNumber }, {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }
    ) 

    return response.data
}