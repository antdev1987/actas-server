import express from 'express'
const router = express.Router()


import {login} from '../controllers/userController.js'

//api/user/login
router.get('/login',login)


export default router