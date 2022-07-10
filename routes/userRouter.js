import express from 'express'
const router = express.Router()

import checkAuth from '../middleware/checkAuth.js'
import isAdmin from '../middleware/isAdmin.js'

import 
{
    login,
    crearUsuario,
    verUsuario,
    eliminarUsuario,
    movimientosUsuarios
} from '../controllers/userController.js'

//api/user/login
router.post('/login',login)

//api/user/crear-usuario
router.post('/crear-usuario', checkAuth, isAdmin,crearUsuario)
//api/user/ver-usuario
router.get('/ver-usuario',checkAuth, isAdmin, verUsuario)
//api/user/eliminar-usuario/id
router.delete('/eliminar-usuario/:id',checkAuth,isAdmin,eliminarUsuario)

//api/user/movimientos-usuarios
//este router se utiliza para registrar los movimientos de los usuarios
router.get('/movimientos-usuarios',checkAuth,isAdmin, movimientosUsuarios)



export default router