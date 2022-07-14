import Entrega from "../models/Entrega.js";
import Devolucion from "../models/Devolucion.js";
import PlanMantenimiento from "../models/PlanMantenimiento.js";
import cloudinary from "../utils/cloudinary.js";
import obtenerFecha from "../helpers/obtenerFecha.js";
import Eventos from "../models/Eventos.js";
import AdminFiles from "../models/AdminFiles.js";
import selected from "../helpers/selected.js";


//////////////////192.168.100.7:4000/api/actas/crear-folder
const crearFolder = async (req, res) => {
  console.log("en crear folder");

  const { selector } = req.body;
  //mas info en helpers: file: selected.js
  let pickSelector = selected(selector)


  try {

    /*
    siguiente linea de codigo es para confirmar si ya se a creado un folder con nombre similar
    si ya se ha creado no se deja seguir y se envia un mensaje diciendo nombre ya creado
    */
    const isNewFolder = await pickSelector.findOne({ nombre: req.body.nombre });
    if (isNewFolder) {
      return res.json({ msg: "nombre ya creado" });
    }

    // aqui se crea una instancia de la base de datos
    const newFolder = new pickSelector(req.body);

    //this help you to create the folder
    await cloudinary.api.create_folder(`actas/${selector}/${req.body.nombre}`)
    /*
    siguientes lineas es para crear fecha y hora y controlar el movimiento que hace el usuario
    luego se guarda en la base de datos del usuario que esta haciendo los request
    */
    const fullYear = obtenerFecha()
    const movimiento = { type: 'crear folder', accion: `usuario ${req.user.email} ha creado el folder ${newFolder.nombre} tipo ${selector}`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()

    //finalmente se guarda el folder y se envia una respuesta al frontend
    const data = await newFolder.save();
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

///////////////////////192.168.100.7:4000/api/actas/buscar-folder
const buscarFolder = async (req, res) => {
  console.log("en buscar folder");

  try {

    const { selector } = req.body;
    let pickSelector = selected(selector)

    /*
    siguiente linea de codigo es para buscar el folder especificado en el frontend
    de no encontrarse se envia una respuesta folder no encontrado crearlo
    */
    const isFolder = await pickSelector.findOne({ nombre: req.body.nombre });
    if (!isFolder) {
      return res.json({ msg: "folder no encontrado, crealo" });
    }

    //si el folder se encontro se manda la informacion al frontend
    res.json(isFolder);
  } catch (error) {
    console.log(error);
  }
};

/////////////////192.168.100.7:4000/api/actas/guardar-archivos/someid
const guardarArchivos = async (req, res) => {
  console.log("en guardar archivos");

  const { id } = req.params;

  //bloque de codigo siguiente es para especificar en que base de datos se va a trabajar
  const { selector } = req.body;
  let pickSelector = selected(selector)

  //next block code: solo es extra seguridad si el folder no existe no sigue adelante
  //igualmente en el frontend no se podra seguir adelante si no existe el folder
  const isFolder = await pickSelector.findById(id);
  if (!isFolder) {
    return res.json({ msg: "folder no existe" });
  }

  try {
    const fullYear = obtenerFecha()
    //next block code: guarda los archivos al servidor, crear los valores necesarios para agregarlos a la bd
    const urls = [];
    for (const file of req.files) {
      const { path } = file;
      const result = await cloudinary.uploader.upload(path, {
        resource_type: "raw",
        filename_override: file.originalname,
        use_filename: true,
        unique_filename: false,
        folder: `actas/${selector}/${isFolder.nombre}`
      });
      console.log(result)
      const newPath = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        originalname: file.originalname,
      };
      const movimiento = { type: 'guardar Archivo/s', accion: `usuario ${req.user.email} ha guardado el archivo ${file.originalname} tipo ${selector} en folder ${isFolder.nombre}`, fecha: fullYear }
      req.user.movimientos.unshift(movimiento)
      urls.push(newPath);
    }

    await req.user.save()

    //almacenar los archivos a la instancia
    for (const item of urls) {
      isFolder.files.push(item);
    }

    const dataSaved = await isFolder.save();
    res.status(201).json(dataSaved);
  } catch (error) {
    console.log('error en el try catch', error);
  }
};



///////////////////192.168.100.7:4000/api/actas/descargar-un-archivo
const descargarArchivo = async (req, res) => {
  //esta funcion no tiene mucha funcionalidad solo es para registar cuando el usuario descarga un archivo
  console.log('en descargar archivo')
  const { originalName, tipo, nombre } = req.query

  console.log(originalName, tipo, nombre)

  try {

    const fullYear = obtenerFecha()
    const movimiento = { type: 'descargar archivo', accion: `usuario ${req.user.email} ha descargado el archivo ${originalName} tipo ${tipo ?? 'admin'} en folder ${nombre ?? 'admin'}`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()

    res.json('testing')

  } catch (error) {
    console.log(error)
  }

}


///////////////////192.168.100.7:4000/api/actas/eliminar-un-archivo
const eliminarUnArchivo = async (req, res) => {

  console.log('en eliminar archivo')
  const { id, selector, public_id } = req.query

  //bloque de codigo siguiente es para especificar en que base de datos se va a trabajar
  let pickSelector = selected(selector)

  //next block code: solo es extra seguridad si el folder no existe no sigue adelante
  //igualmente en el frontend no se podra seguir adelante si no existe el folder
  try {
    const isFolder = await pickSelector.findById(id);
    if (!isFolder) {
      return res.json({ msg: "archivo no existe" });
    }


    //to delete the file from cloudinary
    await cloudinary.uploader.destroy(public_id, { resource_type: 'raw', folder: isFolder.nombre })

    //obitiene el nombre del archivo
    const fileName = public_id.split('/')[3]

    const fullYear = obtenerFecha()
    const movimiento = { type: 'eliminar archivo', accion: `usuario ${req.user.email} ha eliminado el archivo ${fileName} tipo ${selector} en folder ${isFolder.nombre}`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()

    //to delete the references to the id file in cloudinary from mongodb,
    //the reference it is inside an array of object
    const data = await pickSelector.findByIdAndUpdate({ _id: id }, { "$pull": { "files": { "public_id": public_id } } }, { new: true })

    res.json(data)

  } catch (error) {
    console.log(error)
  }

}



///////////////192.168.100.7:4000/api/actas/eliminar-folder
//elimina el folder y todos los archivos en el
const eliminarFolder = async (req, res) => {

  console.log('en eliminar folder')
  const { id, selector } = req.query


  let pickSelector = selected(selector)

  //next block code: solo es extra seguridad si el folder no existe no sigue adelante
  //igualmente en el frontend no se podra seguir adelante si no existe el folder
  const isFolder = await pickSelector.findById(id);
  if (!isFolder) {
    return res.json({ msg: "folder no existe" });
  }

  try {

    //to delete the files from cloudinary first
    for (const item of isFolder.files) {
      await cloudinary.uploader.destroy(item.public_id, { resource_type: 'raw' })
    }

    //this delete the folder from cloudinary after delete all files first in function above
    await cloudinary.api.delete_folder(`actas/${selector}/${isFolder.nombre}`)

    //esto es para controlar la fecha y hora de la eliminacion y registra el usuario que realizo la accion
    const fullYear = obtenerFecha()
    const movimiento = { type: 'eliminar folder', accion: `usuario ${req.user.email} ha eliminado el folder ${isFolder.nombre} tipo ${selector}`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()


    //aqui se eliminar el nombre del folder de la base de datos
    await isFolder.remove()
    res.json({ msg: 'folder deleted' })

  } catch (error) {
    console.log(error, 'error despues de eliminar forlder')
  }

}

//////////////////////192.168.100.7:4000/api/actas/obtener-bds
const obtenerBds = async (req, res) => {
  //este api solo es para la funcionalidad de buscar en la pagina control del frontend
  //entonces toda la funcionalidad de buscar se maneja en el frontend
  console.log('en obtener bds')
  try {
    const entrega = await Entrega.find()
    const devolucion = await Devolucion.find()
    const planMantenimiento = await PlanMantenimiento.find()

    res.json({
      entrega,
      devolucion,
      planMantenimiento
    })

  } catch (error) {
    console.log(error)
  }

}


/////////////funciones de los eventos en la parte del calendario
//agregar o editar un evento
const agregarOEditarEvento = async (req, res) => {

  console.log('en agregar evento')

  try {

    /* agregar y editar evento son similares es por eso que cree el codigo de abajo para decidir
      si se esta editando o agregando una evento, asi se evita hacer un endpoint adicional
    */
    let evento
    if(req.body._id){
      evento = await Eventos.findById(req.body._id)
    }else{
      evento = new Eventos(req.body)
    }

    evento.title = req.body.title || evento.title
    evento.start = req.body.start || evento.start
    evento.end = req.body.end || evento.end
    evento.user = req.body.user || evento.user

    const dataSaved = await evento.save()

    res.status(201).json(dataSaved)

  } catch (error) {
    console.log(error)
  }

}

//obtener los eventos por si cambia de pagina o actualizar el navegador
const obtenerEventos = async (req, res) => {

  try {

    const eventos = await Eventos.find()

    res.json(eventos)

  } catch (error) {
    console.log(error)
  }

}

//eliminar los eventos
const eliminarEvento = async (req, res) => {

  const { id } = req.params

  try {

    await Eventos.findOneAndRemove({ _id: id })

    res.json({ msg: 'evento eliminado' })


  } catch (error) {
    console.log(error)
  }

}


/////////////codigo para guardar archivo que el admin suba
const guardarArchivosAdmin = async (req, res) => {
  console.log(req.files, "aqui")
  console.log('en guardar archivos')

  try {

    //convierto un nuevo array de nombres para luego hacer un query
    const busqueda = req.files.map(item => {
      return item.originalname
    })
    /*aqui se hace el query en el array transformado para verficiar 
    se alguno de los archivos que esta subiendo ya ha sido subido
    */
    const isArchivo = await AdminFiles.find({
      'originalname': { $in: busqueda }
    })
    //en caso de que este intentando subir un archivo ya subido, no lo dejamos y mandamos un mensaje
    if (isArchivo.length >= !0) {
      res.status(400).json({ msg: 'Esta subiendo archivo que ya existe' })
      return
    }

    const fullYear = obtenerFecha()
    //next block code: guarda los archivos al servidor, crear los valores necesarios para agregarlos a la bd
    const dataTransformed = [];
    for (const file of req.files) {
      const { path } = file;
      const result = await cloudinary.uploader.upload(path, {
        resource_type: "raw",
        filename_override: file.originalname,
        use_filename: true,
        unique_filename: false,
        folder: 'actas/AdminFiles'
      });
      const newPath = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        originalname: file.originalname,
      };
      const movimiento = { type: 'guardar Archivo/s admin', accion: `El Administrador ${req.user.email} ha guardado el archivo ${file.originalname}`, fecha: fullYear }
      req.user.movimientos.unshift(movimiento)
      dataTransformed.push(newPath);
    }

    await req.user.save()

    //este alamacenos varios datos a la vez
    const newArchivo = await AdminFiles.insertMany(dataTransformed)


    res.status(201).json(newArchivo)

  } catch (error) {
    console.log(error)
  }

}


//codigo para eliminar archivo subido por el admin
const eliminarArchivoAdmin = async (req, res) => {

  const { id, public_id } = req.query

  const isFolder = await AdminFiles.findById(id);
  if (!isFolder) {
    return res.json({ msg: "folder no existe" });
  }

  console.log(public_id)
  try {

    //to delete the file from cloudinary
    await cloudinary.uploader.destroy(public_id, { resource_type: 'raw' })

    //obitiene el nombre del archivo
    const fileName = public_id.split('/')[2]

    const fullYear = obtenerFecha()
    const movimiento = { type: 'eliminar archivo admin', accion: `El Administrador ${req.user.email} ha eliminado el archivo ${fileName} del folder Administrador`, fecha: fullYear }
    req.user.movimientos.unshift(movimiento)
    await req.user.save()



    isFolder.remove()
    res.json({ msg: 'folder ha sido removido' })

  } catch (error) {
    console.log(error)
  }

}

//obtener los archivos que el admin sube se muestra en el sidebar por si actualiza la pagina
const obtenerArchivosAdmin = async (req, res) => {

  try {

    const adminFiles = await AdminFiles.find()

    res.json(adminFiles)

  } catch (error) {
    console.log(error)
  }

}


export {
  guardarArchivos,
  crearFolder,
  buscarFolder,
  descargarArchivo,
  eliminarUnArchivo,
  obtenerBds,
  eliminarFolder,
  agregarOEditarEvento,
  obtenerEventos,
  eliminarEvento,

  guardarArchivosAdmin,
  eliminarArchivoAdmin,
  obtenerArchivosAdmin
};
