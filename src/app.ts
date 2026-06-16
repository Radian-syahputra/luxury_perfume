import express from "express";
import cookieParser from "cookie-parser";
import 'dotenv/config'
import cors from 'cors'

import authRoute from './modules/auth/auth.route'
import productRoute from './modules/product/product.route'
import cartRoute from './modules/cart/cart.route'


const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)

app.get('/', (_ , res) => {
    res.send("API BERJALAN")
})

app.listen(PORT, () => {
    console.log(`Server backend berjalan di port : ${PORT}`);
})