import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import connectDb from './db/connect.js'

const app = express()
app.use(cors())


app.use(express.static('./uploads'))

// const d_t = new Date();

// let year = d_t.getFullYear()
// let month = d_t.getMonth()
// let day = d_t.getDate()

// const fullYear = `${day}/${month}/${year}`

// console.log(typeof fullYear)
// console.log(day, '', +'', month,'' +'', year)

// const d_t = new Date();
 
// let year = d_t.getFullYear();
// let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
// let day = ("0" + d_t.getDate()).slice(-2);
// let hour = d_t.getHours();
// let minute = d_t.getMinutes();
// let seconds = d_t.getSeconds();

// // prints date & time in YYYY-MM-DD HH:MM:SS format
// console.log(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds);

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