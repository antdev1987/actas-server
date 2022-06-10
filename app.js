import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import connectDb from './db/connect.js'

const app = express()
app.use(cors())


app.use(express.static('./uploads'))


//importando las rutas
import userRouter from './routes/userRouter.js'
import actasRouter from './routes/actasRouter.js'

//esto nos permite obtener la informacion del frontend los datos
app.use(express.json())


//dando acceso a las rutas
app.use('/api/user',userRouter)
app.use('/api/actas',actasRouter)

//este es para correr la aplicacion en el puerto 4000 --
//y cuando este en heroku use un puerto diferente el que heroku provea
const port = process.env.PORT || 4000


//esta es la configuracion para arrancar el servidor
const start = async()=>{
    try {
        await connectDb()
        app.listen(port,console.log(`server is runing on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

//aqui se ejecuta para iniciar la app
start()