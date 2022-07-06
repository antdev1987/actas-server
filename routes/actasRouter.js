import express from 'express'
const router = express.Router()
import multer from 'multer'

import checkAuth from '../middleware/checkAuth.js'

import {
    guardarArchivos,
    crearFolder,
    buscarFolder,
    eliminarUnArchivo,
    obtenerBds,
    eliminarFolder,
    descargarArchivo,
    agregarEvento,
    obtenerEventos,
    eliminarEvento
} from '../controllers/actasController.js'



//este midleware the express es para cargar los archivos enviados del frontend
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
router.get('/descargar-un-archivo',checkAuth,descargarArchivo)

//192.168.100.7:4000/api/actas/eliminar-un-archivo
router.delete('/eliminar-un-archivo',checkAuth,eliminarUnArchivo)

//192.168.100.7:4000/api/actas/eliminar-folder
router.delete('/eliminar-folder',checkAuth, eliminarFolder)


router.post('/agregar-evento', agregarEvento)
router.get('/obtener-eventos', obtenerEventos)
router.delete('/eliminar-evento/:id',eliminarEvento)

//192.168.100.7:4000/api/actas/buscar-nombre
// router.get('/buscar-nombre',checkAuth, buscarNombre)


export default router