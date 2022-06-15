import express from 'express'
const router = express.Router()
import multer from 'multer'

import checkAuth from '../middleware/checkAuth.js'

import {
    guardarArchivos,
    crearFolder,
    buscarFolder,
    eliminarUnArchivo,
    obtenerBds
} from '../controllers/actasController.js'




const upload = multer({
  storage:multer.diskStorage({}),
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
}).array('myFiles')
 

//api/actas/guardar-archivos
router.post('/guardar-archivos/:id',checkAuth,upload, guardarArchivos)

//192.168.100.7:4000/api/actas/crear-folder
router.post('/crear-folder' ,checkAuth, crearFolder)
//192.168.100.7:4000/api/actas/buscar-folder
router.post('/buscar-folder',checkAuth,buscarFolder)

//192.168.100.7:4000/api/actas/obtener-bds
router.get('/obtener-bds',checkAuth,obtenerBds)

//192.168.100.7:4000/api/actas/eliminar-un-archivo
router.delete('/eliminar-un-archivo',checkAuth,eliminarUnArchivo)


export default router