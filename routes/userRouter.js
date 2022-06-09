import express from 'express'
const router = express.Router()

import checkAuth from '../middleware/checkAuth.js'
import isAdmin from '../middleware/isAdmin.js'

import 
{
    login,
    crearUsuario
} from '../controllers/userController.js'

//api/user/login
router.get('/login',login)

//api/user/crear-usuario
router.post('/crear-usuario', checkAuth, isAdmin,crearUsuario)


export default router