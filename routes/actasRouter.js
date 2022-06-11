import express from 'express'
const router = express.Router()

import checkAuth from '../middleware/checkAuth.js'

import {
    guardarArchivos,
    crearFolder,
    buscarFolder
} from '../controllers/actasController.js'


import multer from 'multer'


var storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + file.originalname )
  }
})
 
var upload = multer({ storage: storage })

//api/actas/guardar-archivos
router.post('/guardar-archivos/:id',checkAuth,upload.array('myFiles',5), guardarArchivos)


router.post('/crear-folder' ,checkAuth, crearFolder)
router.post('/buscar-folder',checkAuth,buscarFolder)
export default router