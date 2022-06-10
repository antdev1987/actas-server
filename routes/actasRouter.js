import express from 'express'
const router = express.Router()

import {
    guardarArchivos,
    crearFolder,
    buscarFolder
} from '../controllers/actasController.js'


import multer from 'multer'

// var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//       callback(null, './uploads');
//     },
//     filename: function (req, file, callback) {
//       callback(null, file.fieldname + '-' + Date.now());
//     }
//   });


//   var upload = multer({ storage : storage }).array('userPhoto',2);

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
router.post('/guardar-archivos/:id',upload.array('myFiles',2), guardarArchivos)


router.post('/crear-folder' , crearFolder)
router.post('/buscar-folder',buscarFolder)
export default router